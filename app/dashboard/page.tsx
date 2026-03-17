'use client'

import { useState } from 'react'
import { useVicidialBridge, VicidialBridgeFrame } from '@/components/VicidialBridge'

export default function DashboardPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [statusCode, setStatusCode] = useState('')
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

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString()
    const entry = `[${time}] ${message}`
    setLogs(prev => [entry, ...prev].slice(0, 100))
  }

  const handlePause = async () => {
    try {
      addLog('Pausing agent...')
      const result = await pause()
      addLog(`Pause: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleResume = async () => {
    try {
      addLog('Resuming agent...')
      const result = await resume()
      addLog(`Resume: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleHangup = async () => {
    try {
      addLog('Hanging up...')
      const result = await hangup()
      addLog(`Hangup: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleDial = async () => {
    if (!phoneNumber) {
      addLog('Please enter a phone number')
      return
    }
    try {
      addLog(`Dialing ${phoneNumber}...`)
      const result = await dial(phoneNumber)
      addLog(`Dial: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleStatus = async () => {
    if (!statusCode) {
      addLog('Please enter a status code')
      return
    }
    try {
      addLog(`Setting status to ${statusCode}...`)
      const result = await setDisposition(statusCode)
      addLog(`Status: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      addLog('Logging out...')
      const result = await logout()
      addLog(`Logout: ${result}`)
    } catch (e: any) {
      addLog(`Error: ${e.message}`)
    }
  }

  return (
    <div>
      <VicidialBridgeFrame 
        vicidialUrl="https://dialer.synapselabs.us/agc/crm_bridge.php"
        iframeRef={iframeRef}
        onStatusChange={(s, m) => addLog(`Bridge: ${s} - ${m}`)}
      />

      <div className="control-panel" style={{ marginBottom: '24px', background: '#e7f3ff', border: '1px solid #b3d9ff' }}>
        <h2 style={{ marginBottom: '12px' }}>VICIdial Integration (Window Messaging Bridge)</h2>
        <p>This method uses postMessage to communicate between CRM and VICIdial iframe.</p>
        <p><strong>Bridge Status:</strong> {isReady ? 'Connected' : 'Connecting...'}</p>
      </div>

      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Status:</span>
          <span className={`status-value ${isReady ? 'active' : ''}`}>
            {isReady ? 'Connected' : 'Connecting...'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Agent:</span>
          <span className="status-value">2416</span>
        </div>
        <div className="status-item">
          <span className="status-label">Campaign:</span>
          <span className="status-value">INBRETEN</span>
        </div>
      </div>

      <div className="controls-grid">
        <div className="control-panel">
          <h3>Agent Status</h3>
          <div className="button-group">
            <button className="btn btn-warning" onClick={handlePause} disabled={!isReady}>
              Pause
            </button>
            <button className="btn btn-success" onClick={handleResume} disabled={!isReady}>
              Resume
            </button>
          </div>
        </div>

        <div className="control-panel">
          <h3>Call Control</h3>
          <div className="button-group">
            <button className="btn btn-danger" onClick={handleHangup} disabled={!isReady}>
              Hangup
            </button>
            <button className="btn btn-secondary" onClick={handleLogout} disabled={!isReady}>
              Logout
            </button>
          </div>
        </div>

        <div className="control-panel">
          <h3>Manual Dial</h3>
          <div className="dial-input">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
            />
            <button className="btn btn-primary" onClick={handleDial} disabled={!isReady}>
              Dial
            </button>
          </div>
        </div>

        <div className="control-panel">
          <h3>Disposition</h3>
          <div className="dial-input">
            <input
              type="text"
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value)}
              placeholder="Status code"
            />
            <button className="btn btn-primary" onClick={handleStatus} disabled={!isReady}>
              Set
            </button>
          </div>
        </div>
      </div>

      <div className="control-panel" style={{ marginTop: '24px' }}>
        <h2>Activity Log</h2>
        <div className="log-panel">
          {logs.length === 0 ? (
            <div className="log-entry">
              <span className="time">[--:--:--]</span> Waiting for activity...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
