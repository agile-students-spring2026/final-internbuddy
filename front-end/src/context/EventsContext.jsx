import { createContext, useState, useEffect } from 'react'
import { faker } from '@faker-js/faker'

export const EventsContext = createContext()

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fakeEvents = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      time: faker.date.soon().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: faker.date.soon().toLocaleDateString(),
      location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    }))
    setEvents(fakeEvents)
  }, [])

  const addEvent = (newEvent) => {
    setEvents(prev => [{ ...newEvent, id: Date.now() }, ...prev])
  }

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

