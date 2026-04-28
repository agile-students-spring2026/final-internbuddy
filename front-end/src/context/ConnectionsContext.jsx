import { createContext, useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export const ConnectionsContext = createContext()

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function ConnectionsProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(null)
  const [pending, setPending] = useState([])
  const [sent, setSent] = useState([])
  const [accepted, setAccepted] = useState([])

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setCurrentUserId(null)
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

        if (!userId) {
          setPending([])
          setSent([])
          setAccepted([])
          return
        }

        fetch(`/api/connections/${userId}/pending`, { headers: authHeaders() })
          .then(res => res.json())
          .then(data => setPending(data.pending || []))

        fetch(`/api/connections/${userId}/sent`, { headers: authHeaders() })
          .then(res => res.json())
          .then(data => setSent(data.sent || []))

        fetch(`/api/connections/${userId}`, { headers: authHeaders() })
          .then(res => res.json())
          .then(data => setAccepted(data.accepted || []))
      })
      .catch(() => {
        setCurrentUserId(null)
        setPending([])
        setSent([])
        setAccepted([])
      })
  }, [])

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
