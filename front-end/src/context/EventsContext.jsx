import { createContext, useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export const EventsContext = createContext()

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
    const token = getToken()
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}
