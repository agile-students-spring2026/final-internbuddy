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
    if (!userId || !headers.Authorization) return Promise.resolve()

    return Promise.all([
      fetch(`/api/connections/${userId}/pending`, { headers })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setPending(data.pending || []) })
        .catch(() => {}),
      fetch(`/api/connections/${userId}/sent`, { headers })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setSent(data.sent || []) })
        .catch(() => {}),
      fetch(`/api/connections/${userId}`, { headers })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setAccepted(data.accepted || []) })
        .catch(() => {}),
    ])
  }, [])

  const refreshConnections = useCallback(() => {
    const userId = currentUserIdRef.current
    if (!userId) return Promise.resolve()
    return fetchConnections(userId)
  }, [fetchConnections])

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
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to send connection request')
        }
        return data
      })
      .then(data => {
        if (data.request) {
          setSent(prev => prev.some(item => item.id === data.request.id) ? prev : [...prev, data.request])
        }
        return refreshConnections().then(() => data)
      })
  }

  function acceptRequest(requestId) {
    return fetch(`/api/connections/${requestId}/accept`, {
      method: 'POST',
      headers: authHeaders(),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to accept connection request')
        }
        return data
      })
      .then(data => {
        setPending(prev => prev.filter(r => r.id !== requestId))
        if (data.request) setAccepted(prev => [...prev, data.request])
        return refreshConnections().then(() => data)
      })
  }

  function rejectRequest(requestId) {
    return fetch(`/api/connections/${requestId}/reject`, {
      method: 'POST',
      headers: authHeaders(),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to reject connection request')
        }
        return data
      })
      .then((data) => {
        setPending(prev => prev.filter(r => r.id !== requestId))
        return refreshConnections().then(() => data)
      })
  }

  function cancelRequest(requestId) {
    return fetch(`/api/connections/${requestId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to cancel connection request')
        }
        return data
      })
      .then(data => {
        setSent(prev => prev.filter(r => r.id !== requestId))
        return refreshConnections().then(() => data)
      })
  }

  return (
    <ConnectionsContext.Provider value={{ currentUserId, pending, sent, accepted, sendRequest, acceptRequest, rejectRequest, cancelRequest, refreshConnections }}>
      {children}
    </ConnectionsContext.Provider>
  )
}
