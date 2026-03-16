'use client'

import { useState } from 'react'
import DialerControls from '@/components/DialerControls'

export default function DashboardPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [agentUser] = useState('2416')

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString()
    const entry = `[${time}] ${message}`
    setLogs(prev => [entry, ...prev].slice(0, 100))
  }

  return (
    <div>
      <div className="control-panel" style={{ marginBottom: '24px', background: '#e7f3ff', border: '1px solid #b3d9ff' }}>
        <h2 style={{ marginBottom: '12px' }}>VICIdial Integration</h2>
        <p>VICIdial loads automatically in the background when you visit this page.</p>
        <p>Use the controls below to interact with the agent.</p>
      </div>

      <DialerControls agentUser={agentUser} onLog={addLog} />

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
