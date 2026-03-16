'use client'

import { useEffect, useRef, useState } from 'react'

interface VicidialFrameProps {
  vicidialUrl?: string
  onStatusChange?: (status: 'loading' | 'ready' | 'error', message?: string) => void
}

export default function VicidialFrame({ 
  vicidialUrl = '/api/vicidial/bootstrap',
  onStatusChange 
}: VicidialFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted && iframeRef.current) {
      setHasStarted(true)
      onStatusChange?.('loading', 'Starting VICIdial session...')
      iframeRef.current.src = vicidialUrl
    }
  }, [vicidialUrl, hasStarted, onStatusChange])

  const handleIframeLoad = () => {
    setIsReady(true)
    onStatusChange?.('ready', 'VICIdial session loaded')
  }

  const handleIframeError = () => {
    onStatusChange?.('error', 'Failed to load VICIdial session')
  }

  return (
    <iframe
      ref={iframeRef}
      id="vicidial-hidden-frame"
      name="vicidialAgentFrame"
      title="VICIdial Agent Background Session"
      src={hasStarted ? vicidialUrl : undefined}
      onLoad={handleIframeLoad}
      onError={handleIframeError}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
        border: 0,
        visibility: 'hidden',
      }}
      allow="microphone; autoplay"
      sandbox="allow-same-origin allow-scripts allow-forms"
    />
  )
}

export function useVicidialSession() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const handleStatusChange = (newStatus: 'loading' | 'ready' | 'error', msg?: string) => {
    setStatus(newStatus)
    setMessage(msg || '')
  }

  return {
    status,
    message,
    handleStatusChange,
    isReady: status === 'ready',
    isLoading: status === 'loading',
    hasError: status === 'error',
  }
}
