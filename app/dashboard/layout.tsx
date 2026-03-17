'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [agentUser] = useState('2416')

  useEffect(() => {
    const user = localStorage.getItem('crm_user')
    if (!user) {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('crm_user')
    router.push('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>CRM Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
