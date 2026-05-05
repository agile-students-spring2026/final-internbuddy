import { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { getToken } from '../utils/auth'

export const ConnectionsContext = createContext()

const POLL_INTERVAL_MS = 5000

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function ConnectionsProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(null)
  const [pending, setPending] = useState([])
  const [sent, setSent] = useState([])
  const [accepted, setAccepted] = useState([])
  const currentUserIdRef = useRef(null)

  const fetchConnections = useCallback((userId) => {
    const headers = authHeaders()
    if (!userId || !headers.Authorization) return

    fetch(`/api/connections/${userId}/pending`, { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setPending(data.pending || []) })
      .catch(() => {})

    fetch(`/api/connections/${userId}/sent`, { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setSent(data.sent || []) })
      .catch(() => {})

    fetch(`/api/connections/${userId}`, { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAccepted(data.accepted || []) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setCurrentUserId(null)
      currentUserIdRef.current = null
      setPending([])
      setSent([])
      setAccepted([])
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const userId = data?.user?.id || null
        setCurrentUserId(userId)
        currentUserIdRef.current = userId

        if (!userId) {
          setPending([])
          setSent([])
          setAccepted([])
          return
        }

        fetchConnections(userId)
      })
      .catch(() => {
        setCurrentUserId(null)
        currentUserIdRef.current = null
        setPending([])
        setSent([])
        setAccepted([])
      })
  }, [fetchConnections])

  // Poll for new pending requests every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const userId = currentUserIdRef.current
      if (userId) {
        fetchConnections(userId)
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
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
