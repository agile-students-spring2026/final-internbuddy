import { useState, useEffect, useRef, useCallback } from 'react'
import { ConnectionsContext } from './ConnectionsContext'
import { authHeaders, getToken } from '../utils/auth'

const POLL_INTERVAL_MS = 5000

export function ConnectionsProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(null)
  const [pending, setPending] = useState([])
  const [sent, setSent] = useState([])
  const [accepted, setAccepted] = useState([])
  const currentUserIdRef = useRef(null)

  const fetchConnections = useCallback(() => {
    const headers = authHeaders()
    if (!headers.Authorization) return

    fetch('/api/connections/pending', { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setPending(data.pending || []) })
      .catch(() => {})

    fetch('/api/connections/sent', { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setSent(data.sent || []) })
      .catch(() => {})

    fetch('/api/connections/accepted', { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAccepted(data.accepted || []) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false

    async function tick() {
      const token = getToken()
      if (!token) {
        if (currentUserIdRef.current) {
          currentUserIdRef.current = null
          setCurrentUserId(null)
        }
        return
      }

      if (!currentUserIdRef.current) {
        try {
          const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          if (cancelled || !res.ok) return
          const data = await res.json()
          if (cancelled) return
          const userId = data?.user?.id || null
          currentUserIdRef.current = userId
          setCurrentUserId(userId)
          if (!userId) return
        } catch {
          return
        }
      }

      fetchConnections()
    }

    tick()
    const interval = setInterval(tick, POLL_INTERVAL_MS)
    return () => { cancelled = true; clearInterval(interval) }
  }, [fetchConnections])

  function sendRequest(toUserId) {
    if (!currentUserId) {
      return Promise.reject(new Error('Must be logged in to send connection requests'))
    }

    return fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ toUserId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.request) {
          setSent(prev => [...prev, data.request])
        }
        return data
      })
  }

  function acceptRequest(requestId) {
    return fetch(`/api/connections/${requestId}/accept`, {
      method: 'POST',
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        setPending(prev => prev.filter(r => r.id !== requestId))
        setAccepted(prev => [...prev, data.request])
      })
  }

  function rejectRequest(requestId) {
    return fetch(`/api/connections/${requestId}/reject`, {
      method: 'POST',
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(() => {
        setPending(prev => prev.filter(r => r.id !== requestId))
      })
  }

  function cancelRequest(requestId) {
    return fetch(`/api/connections/${requestId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        setSent(prev => prev.filter(r => r.id !== requestId))
        return data
      })
  }

  return (
    <ConnectionsContext.Provider value={{ currentUserId, pending, sent, accepted, sendRequest, acceptRequest, rejectRequest, cancelRequest }}>
      {children}
    </ConnectionsContext.Provider>
  )
}
