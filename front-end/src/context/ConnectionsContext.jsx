import { createContext, useState, useEffect } from 'react'

export const ConnectionsContext = createContext()

// hardcoded for now since we don't have real auth yet
const MY_USER_ID = '1'

export function ConnectionsProvider({ children }) {
  const [pending, setPending] = useState([])
  const [sent, setSent] = useState([])
  const [accepted, setAccepted] = useState([])

  useEffect(() => {
    fetch(`/api/connections/${MY_USER_ID}/pending`)
      .then(res => res.json())
      .then(data => setPending(data.pending))

    fetch(`/api/connections/${MY_USER_ID}/sent`)
      .then(res => res.json())
      .then(data => setSent(data.sent))

    fetch(`/api/connections/${MY_USER_ID}`)
      .then(res => res.json())
      .then(data => setAccepted(data.accepted))
  }, [])

  function sendRequest(toUserId) {
    return fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId: MY_USER_ID, toUserId })
    })
      .then(res => res.json())
      .then(data => {
        setSent(prev => [...prev, data.request])
        return data
      })
  }

  function acceptRequest(requestId) {
    return fetch(`/api/connections/${requestId}/accept`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setPending(prev => prev.filter(r => r.id !== requestId))
        setAccepted(prev => [...prev, data.request])
      })
  }

  function rejectRequest(requestId) {
    return fetch(`/api/connections/${requestId}/reject`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setPending(prev => prev.filter(r => r.id !== requestId))
      })
  }

  function cancelRequest(requestId) {
    return fetch(`/api/connections/${requestId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        setSent(prev => prev.filter(r => r.id !== requestId))
        return data
      })
  }

  return (
    <ConnectionsContext.Provider value={{ pending, sent, accepted, sendRequest, acceptRequest, rejectRequest, cancelRequest }}>
      {children}
    </ConnectionsContext.Provider>
  )
}
