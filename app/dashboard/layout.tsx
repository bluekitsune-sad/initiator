'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VicidialFrame, { useVicidialSession } from '@/components/VicidialFrame'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [agentUser] = useState('2416')
  const { status: vicidialStatus, message, handleStatusChange, isReady } = useVicidialSession()

  useEffect(() => {
    const user = localStorage.getItem('crm_user')
    if (!user) {
      router.push('/')
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/vicidial/agent?function=logout', { method: 'GET' })
    } catch (e) {
      console.log('Logout API error (expected)')
    }
    localStorage.removeItem('crm_user')
    localStorage.removeItem('vicidial_session_ready')
    router.push('/')
  }

  return (
    <div className="dashboard">
      <VicidialFrame onStatusChange={handleStatusChange} />

      <header className="dashboard-header">
        <h1>CRM Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="status-label">VICIdial:</span>
          <span className={`status-value ${isReady ? 'active' : ''}`}>
            {vicidialStatus === 'loading' ? 'Connecting...' : 
             vicidialStatus === 'ready' ? 'Connected' : 
             vicidialStatus === 'error' ? 'Error' : 'Idle'}
          </span>
          <span className="status-label">Agent:</span>
          <span className="status-value">{agentUser}</span>
          <span className="status-label">Campaign:</span>
          <span className="status-value">INBRETEN</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
