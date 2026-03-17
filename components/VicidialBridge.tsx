'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface BridgeMessage {
  id?: number
  action?: string
  type?: string
  status?: string
  message?: string
}

export function useVicidialBridge(agentUser: string = '2416') {
  const [isReady, setIsReady] = useState(false)
  const [status, setStatus] = useState('disconnected')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pendingRef = useRef<Map<number, { resolve: Function; reject: Function }>>(new Map())
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as BridgeMessage
      
      if (data.type === 'bridge_ready') {
        setIsReady(true)
        setStatus('connected')
        return
      }
      
      if (data.id && pendingRef.current.has(data.id)) {
        const pending = pendingRef.current.get(data.id)
        pendingRef.current.delete(data.id)
        
        if (data.status === 'ok') {
          pending?.resolve(data.message || 'OK')
        } else {
          pending?.reject(data.message || 'Error')
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      loadedRef.current = false
    }
  }, [])

  const sendCommand = useCallback((action: string, params: Record<string, string> = {}): Promise<string> => {
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
          agent_user: agentUser,
          ...params
        }, '*')
      } catch (e) {
        pendingRef.current.delete(id)
        reject(e)
        return
      }

      setTimeout(() => {
        if (pendingRef.current.has(id)) {
          pendingRef.current.delete(id)
          reject(new Error('Request timeout'))
        }
      }, 15000)
    })
  }, [agentUser])

  const pause = () => sendCommand('pause', { value: 'PAUSE' })
  const resume = () => sendCommand('pause', { value: 'RESUME' })
  const hangup = () => sendCommand('hangup', { value: '1' })
  const dial = (phone: string) => sendCommand('dial', { phone_number: phone, search: 'YES', preview: 'YES', focus: 'YES' })
  const setDisposition = (code: string) => sendCommand('status', { status: code })
  const logout = () => sendCommand('logout', { value: 'LOGOUT' })
  const ping = () => sendCommand('ping', {})

  return {
    isReady,
    status,
    iframeRef,
    pause,
    resume,
    hangup,
    dial,
    setDisposition,
    logout,
    ping,
  }
}
