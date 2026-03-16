'use client'

import { useState } from 'react'

interface DialerControlsProps {
  agentUser?: string
  onLog?: (message: string) => void
}

export default function DialerControls({ agentUser = '2416', onLog }: DialerControlsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState('')

  const log = (msg: string) => {
    console.log(msg)
    onLog?.(msg)
  }

  const callApi = async (func: string, params: Record<string, string> = {}) => {
    setLoading(func)
    try {
      const queryParams = new URLSearchParams({
        function: func,
        agent_user: agentUser,
        ...params,
      })

      const response = await fetch(`/api/vicidial/agent?${queryParams.toString()}`)
      const text = await response.text()
      log(`${func}: ${text.substring(0, 150)}`)
      return text
    } catch (error) {
      log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    } finally {
      setLoading(null)
    }
  }

  const handlePause = async () => {
    await callApi('external_pause', { value: 'PAUSE' })
  }

  const handleResume = async () => {
    await callApi('external_pause', { value: 'RESUME' })
  }

  const handleHangup = async () => {
    await callApi('external_hangup', { value: '1' })
  }

  const handleDial = async () => {
    if (!phoneNumber) {
      log('Please enter a phone number')
      return
    }
    await callApi('external_dial', { 
      phone_number: phoneNumber,
      search: 'YES',
      preview: 'YES',
      focus: 'YES'
    })
  }

  const handleStatus = async () => {
    if (!status) {
      log('Please enter a status code')
      return
    }
    await callApi('external_status', { value: status })
  }

  const handleLogout = async () => {
    await callApi('logout', { value: 'LOGOUT' })
  }

  return (
    <div className="controls-grid">
      <div className="control-panel">
        <h2>Agent Status</h2>
        <div className="button-group">
          <button className="btn btn-warning" onClick={handlePause} disabled={loading !== null}>
            {loading === 'external_pause' ? '...' : 'Pause'}
          </button>
          <button className="btn btn-success" onClick={handleResume} disabled={loading !== null}>
            {loading === 'external_pause' ? '...' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="control-panel">
        <h2>Call Control</h2>
        <div className="button-group">
          <button className="btn btn-danger" onClick={handleHangup} disabled={loading !== null}>
            {loading === 'external_hangup' ? '...' : 'Hangup'}
          </button>
          <button className="btn btn-secondary" onClick={handleLogout} disabled={loading !== null}>
            {loading === 'logout' ? '...' : 'Logout'}
          </button>
        </div>
      </div>

      <div className="control-panel">
        <h2>Manual Dial</h2>
        <div className="dial-input">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <button className="btn btn-primary" onClick={handleDial} disabled={loading !== null}>
            {loading === 'external_dial' ? '...' : 'Dial'}
          </button>
        </div>
      </div>

      <div className="control-panel">
        <h2>Set Status</h2>
        <div className="dial-input">
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status code (e.g., NI)"
          />
          <button className="btn btn-primary" onClick={handleStatus} disabled={loading !== null}>
            {loading === 'external_status' ? '...' : 'Set'}
          </button>
        </div>
      </div>
    </div>
  )
}
