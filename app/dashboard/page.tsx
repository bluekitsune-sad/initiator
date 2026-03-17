'use client'

import { useState, useEffect, useRef } from 'react'

interface BridgeMsg {
  id?: number
  action?: string
  type?: string
  status?: string
  message?: string
  loggedIn?: boolean
  error?: string
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [isReady, setIsReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pendingRef = useRef<Map<number, { resolve: Function; reject: Function }>>(new Map())
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as BridgeMsg
      
      if (data.type === 'bridge_ready') {
        setIsReady(true)
        addLog(`Bridge ready - Logged in: ${data.loggedIn ? 'Yes' : 'No'}`)
        return
      }
      
      if (data.id && pendingRef.current.has(data.id)) {
        const pending = pendingRef.current.get(data.id)
        pendingRef.current.delete(data.id)
        
        if (data.status === 'ok') {
          pending?.resolve(data.message || 'OK')
        } else {
          pending?.reject(new Error(data.message || 'Error'))
        }
      }
    }

    window.addEventListener('message', handleMessage)

    if (iframeRef.current) {
      iframeRef.current.src = 'https://dialer.synapselabs.us/agc/crm_bridge.php'
      addLog('Loading VICIdial bridge...')
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendCommand = (action: string, params: Record<string, string> = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!iframeRef.current?.contentWindow) {
        reject(new Error('Iframe not ready'))
        return
      }

      const id = Date.now()
      pendingRef.current.set(id, { resolve, reject })

      try {
        iframeRef.current.contentWindow.postMessage({
          id,
          action,
          agent_user: '2416',
          ...params
        }, '*')
      } catch (e) {
        pendingRef.current.delete(id)
        reject(e)
      }

      setTimeout(() => {
        if (pendingRef.current.has(id)) {
          pendingRef.current.delete(id)
          reject(new Error('Timeout'))
        }
      }, 30000)
    })
  }

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 30))
  }

  const handlePause = async () => {
    try {
      addLog('Pausing...')
      const result = await sendCommand('pause', { value: 'PAUSE' })
      addLog(`Result: ${String(result).substring(0, 150)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleResume = async () => {
    try {
      addLog('Resuming...')
      const result = await sendCommand('pause', { value: 'RESUME' })
      addLog(`Result: ${String(result).substring(0, 150)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleHangup = async () => {
    try {
      addLog('Hanging up...')
      const result = await sendCommand('hangup', {})
      addLog(`Result: ${String(result).substring(0, 150)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleDial = async () => {
    if (!phoneNumber) {
      addLog('Enter phone number')
      return
    }
    try {
      addLog(`Dialing ${phoneNumber}...`)
      const result = await sendCommand('dial', { phone_number: phoneNumber, search: 'YES', preview: 'YES', focus: 'YES' })
      addLog(`Result: ${String(result).substring(0, 150)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleStatus = async () => {
    if (!statusCode) {
      addLog('Enter status code')
      return
    }
    try {
      addLog(`Setting status ${statusCode}...`)
      const result = await sendCommand('status', { status: statusCode })
      addLog(`Result: ${String(result).substring(0, 150)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      addLog('Logging out...')
      const result = await sendCommand('logout', {})
      addLog(`Result: ${String(result).substring(0, 150)}`)
      setIsReady(false)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleDebug = async () => {
    try {
      addLog('Debug info...')
      const result = await sendCommand('debug', {})
      addLog(`Debug: ${String(result).substring(0, 300)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        title="VICIdial Bridge"
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: '20px', background: '#e7f3ff', padding: '15px' }}>
        <h2>VICIdial - Window Messaging Bridge</h2>
        <p><strong>Status:</strong> {isReady ? '✅ Connected' : '🔄 Connecting...'}</p>
        <p style={{fontSize:'12px',color:'#666'}}>
          Zoiper must be running and logged in for calls to work.
        </p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handlePause} disabled={!isReady} style={{padding:'10px 20px',background:'#f0ad4e',border:'none',cursor:'pointer'}}>Pause</button>
        <button onClick={handleResume} disabled={!isReady} style={{padding:'10px 20px',background:'#5cb85c',border:'none',cursor:'pointer'}}>Resume</button>
        <button onClick={handleHangup} disabled={!isReady} style={{padding:'10px 20px',background:'#d9534f',border:'none',cursor:'pointer'}}>Hangup</button>
        <button onClick={handleLogout} disabled={!isReady} style={{padding:'10px 20px',background:'#777',color:'#fff',border:'none',cursor:'pointer'}}>Logout</button>
        <button onClick={handleDebug} style={{padding:'10px 20px',background:'#337ab7',color:'#fff',border:'none',cursor:'pointer'}}>Debug</button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone number"
          style={{ padding: '10px', width: '150px' }}
        />
        <button onClick={handleDial} disabled={!isReady} style={{padding:'10px 20px',background:'#337ab7',color:'#fff',border:'none',cursor:'pointer'}}>Dial</button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={statusCode}
          onChange={(e) => setStatusCode(e.target.value)}
          placeholder="Status code (e.g. NI)"
          style={{ padding: '10px', width: '150px' }}
        />
        <button onClick={handleStatus} disabled={!isReady} style={{padding:'10px 20px',background:'#337ab7',color:'#fff',border:'none',cursor:'pointer'}}>Set Status</button>
      </div>

      <div style={{ background: '#f5f5f5', padding: '15px' }}>
        <h3>Activity Log</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '12px', marginBottom: '4px', fontFamily: 'monospace' }}>{log}</div>
        ))}
      </div>
    </div>
  )
}
