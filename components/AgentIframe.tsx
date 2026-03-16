'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AgentIframeProps {
  onStatusChange?: (status: string) => void
}

export default function AgentIframe({ onStatusChange }: AgentIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('crm_user')
    if (!user) {
      router.push('/')
      return
    }

    const vicidialUrl = localStorage.getItem('vicidial_session_ready')
    
    if (vicidialUrl && iframeRef.current) {
      iframeRef.current.src = vicidialUrl
      setIsLoaded(true)
    }
  }, [router])

  const handleIframeLoad = () => {
    setIsLoaded(true)
    setSessionReady(true)
    onStatusChange?.('connected')
  }

  const loadVicidial = (url: string) => {
    if (iframeRef.current) {
      localStorage.setItem('vicidial_session_ready', url)
      iframeRef.current.src = url
      setIsLoaded(true)
    }
  }

  if (!sessionReady) {
    return null
  }

  return (
    <iframe
      ref={iframeRef}
      id="vicidial-agent-iframe"
      className="hidden-iframe"
      title="Vicidial Agent Session"
      onLoad={handleIframeLoad}
    />
  )
}

export function useAgentIframe() {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const loadSession = (url: string) => {
    setSessionUrl(url)
    localStorage.setItem('vicidial_session_ready', url)
    setIsReady(true)
  }

  const clearSession = () => {
    setSessionUrl(null)
    setIsReady(false)
    localStorage.removeItem('vicidial_session_ready')
  }

  return {
    sessionUrl,
    isReady,
    loadSession,
    clearSession
  }
}
