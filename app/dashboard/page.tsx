'use client'

import { useState, useEffect } from 'react'
import { useVicidialBridge } from '@/components/VicidialBridge'

export default function DashboardPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [iframeSrc, setIframeSrc] = useState('')
  
  const { 
    isReady, 
    status, 
    iframeRef, 
    pause, 
    resume, 
    hangup, 
    dial, 
    setDisposition, 
    logout,
    ping 
  } = useVicidialBridge('2416')

  useEffect(() => {
    if (!iframeSrc && iframeRef.current) {
      setIframeSrc('https://dialer.synapselabs.us/agc/crm_bridge.php')
      iframeRef.current.src = 'https://dialer.synapselabs.us/agc/crm_bridge.php'
    }
  }, [iframeSrc, iframeRef])

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString()
    const entry = `[${time}] ${message}`
    setLogs(prev => [entry, ...prev].slice(0, 50))
  }

  const handlePause = async () => {
    try {
      addLog('Pausing...')
      const result = await pause()
      addLog(`Result: ${String(result).substring(0, 100)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleResume = async () => {
    try {
      addLog('Resuming...')
      const result = await resume()
      addLog(`Result: ${String(result).substring(0, 100)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleHangup = async () => {
    try {
      addLog('Hanging up...')
      const result = await hangup()
      addLog(`Result: ${String(result).substring(0, 100)}`)
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
      const result = await dial(phoneNumber)
      addLog(`Result: ${String(result).substring(0, 100)}`)
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
      const result = await setDisposition(statusCode)
      addLog(`Result: ${String(result).substring(0, 100)}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      addLog('Logging out...')
      const result = await logout()
      addLog(`Result: ${String(result).substring(0, 100)}`)
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

      <div className="control-panel" style={{ marginBottom: '20px', background: '#e7f3ff' }}>
        <h2>VICIdial - Window Messaging Bridge</h2>
        <p><strong>Bridge Status:</strong> {isReady ? '✅ Connected' : '🔄 Connecting...'}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={handlePause} disabled={!isReady} className="btn btn-warning">Pause</button>
        <button onClick={handleResume} disabled={!isReady} className="btn btn-success">Resume</button>
        <button onClick={handleHangup} disabled={!isReady} className="btn btn-danger">Hangup</button>
        <button onClick={handleLogout} disabled={!isReady} className="btn btn-secondary">Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone number"
          style={{ padding: '8px', width: '150px' }}
        />
        <button onClick={handleDial} disabled={!isReady} className="btn btn-primary">Dial</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={statusCode}
          onChange={(e) => setStatusCode(e.target.value)}
          placeholder="Status code"
          style={{ padding: '8px', width: '150px' }}
        />
        <button onClick={handleStatus} disabled={!isReady} className="btn btn-primary">Set Status</button>
      </div>

      <div className="log-panel">
        <h3>Activity Log</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '12px', marginBottom: '4px' }}>{log}</div>
        ))}
      </div>
    </div>
  )
}
