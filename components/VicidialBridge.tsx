'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface BridgeMessage {
  type?: string
  id?: string | number
  action?: string
  status?: string
  message?: string
  response?: string
}

export function useVicidialBridge(agentUser: string = '2416') {
  const [isReady, setIsReady] = useState(false)
  const [bridgeStatus, setBridgeStatus] = useState<string>('disconnected')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pendingRequests = useRef<Map<number, { resolve: Function; reject: Function }>>(new Map())

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as BridgeMessage
      
      if (data.type === 'bridge_ready') {
        setIsReady(true)
        setBridgeStatus('connected')
        return
      }
      
      const msgId = Number(data.id)
      if (msgId && pendingRequests.current.has(msgId)) {
        const pending = pendingRequests.current.get(msgId)
        pendingRequests.current.delete(msgId)
        
        if (pending) {
          if (data.status === 'ok') {
            pending.resolve(data.response || data.message)
          } else {
            pending.reject(data.message || 'API error')
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const sendCommand = useCallback((action: string, params: Record<string, string> = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!iframeRef.current?.contentWindow || !isReady) {
        reject(new Error('Bridge not ready'))
        return
      }

      const id = Date.now()
      pendingRequests.current.set(id, { resolve, reject })

      iframeRef.current.contentWindow!.postMessage({
        id,
        action,
        agent_user: agentUser,
        ...params
      }, '*')

      setTimeout(() => {
        if (pendingRequests.current.has(id)) {
          pendingRequests.current.delete(id)
          reject(new Error('Request timeout'))
        }
      }, 10000)
    })
  }, [agentUser, isReady])

  const pause = () => sendCommand('pause', { value: 'PAUSE' })
  const resume = () => sendCommand('pause', { value: 'RESUME' })
  const hangup = () => sendCommand('hangup', {})
  const dial = (phoneNumber: string) => sendCommand('dial', { phone_number: phoneNumber })
  const setDisposition = (statusCode: string) => sendCommand('status', { status: statusCode })
  const logout = () => sendCommand('logout', {})
  const ping = () => sendCommand('ping', {})

  return {
    isReady,
    status: bridgeStatus,
    iframeRef,
    pause,
    resume,
    hangup,
    dial,
    setDisposition,
    logout,
    ping,
    sendCommand,
  }
}

export function VicidialBridgeFrame({ 
  vicidialUrl = 'https://dialer.synapselabs.us/agc/crm_bridge.php',
  iframeRef,
  onStatusChange 
}: { 
  vicidialUrl?: string
  iframeRef: React.RefObject<HTMLIFrameElement>
  onStatusChange?: (status: 'loading' | 'ready' | 'error', message?: string) => void
}) {
  useEffect(() => {
    if (iframeRef.current) {
      onStatusChange?.('loading', 'Connecting to VICIdial...')
      iframeRef.current.src = vicidialUrl
    }
  }, [vicidialUrl, onStatusChange, iframeRef])

  const handleIframeLoad = () => {
    console.log('Bridge iframe loaded')
  }

  const handleIframeError = () => {
    onStatusChange?.('error', 'Failed to connect to VICIdial')
  }

  return (
    <iframe
      ref={iframeRef}
      id="vicidial-bridge-frame"
      title="VICIdial Bridge"
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
      }}
    />
  )
}
