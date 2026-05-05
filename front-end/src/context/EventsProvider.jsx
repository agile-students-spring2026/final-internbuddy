import { useState, useEffect } from 'react'
import { EventsContext } from './EventsContext'
import { authHeaders } from '../utils/auth'

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data)
        }
      })
      .catch(err => console.error('Failed to fetch events:', err))
  }, [])

  const addEvent = (newEvent) => {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(newEvent),
    })
      .then(res => res.json())
      .then(created => {
        if (created && created.id) {
          setEvents(prev => [created, ...prev])
        } else {
          console.error('Create event failed:', created)
        }
      })
      .catch(err => console.error('Failed to create event:', err))
  }

  const joinEvent = async (id) => {
    const res = await fetch(`/api/events/${id}/join`, {
      method: 'POST',
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to join')
    setEvents(prev => prev.map(e => (e.id === data.id ? data : e)))
    return data
  }

  const leaveEvent = async (id) => {
    const res = await fetch(`/api/events/${id}/leave`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to leave')
    setEvents(prev => prev.map(e => (e.id === data.id ? data : e)))
    return data
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, joinEvent, leaveEvent }}>
      {children}
    </EventsContext.Provider>
  )
}
