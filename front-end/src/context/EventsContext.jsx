import { createContext, useState, useEffect } from 'react'

export const EventsContext = createContext()

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to fetch events:', err))
  }, [])

  const addEvent = (newEvent) => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then(res => res.json())
      .then(created => setEvents(prev => [created, ...prev]))
      .catch(err => console.error('Failed to create event:', err))
  }

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}
