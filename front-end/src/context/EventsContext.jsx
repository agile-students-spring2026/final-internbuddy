import { createContext, useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export const EventsContext = createContext()

const MOCK_EVENTS = [
  {
    id: 'mock-nyc-tech-mixer',
    title: 'NYC Tech Mixer',
    description: 'Meet software, product, and design interns from across the city.',
    location: 'Chelsea Market, NYC',
    time: '6:30 PM',
    date: 'May 24, 2026',
  },
  {
    id: 'mock-brooklyn-picnic',
    title: 'Brooklyn Bridge Picnic',
    description: 'Sunset picnic and networking with intern groups.',
    location: 'Brooklyn Bridge Park',
    time: '5:00 PM',
    date: 'May 27, 2026',
  },
  {
    id: 'mock-resume-roast',
    title: 'Resume Roast + LinkedIn Tune-Up',
    description: 'Bring your resume for peer review and recruiter tips.',
    location: 'NYU Bobst Library',
    time: '4:00 PM',
    date: 'Jun 1, 2026',
  },
  {
    id: 'mock-cafe-build-night',
    title: 'Cafe Build Night',
    description: 'Code, ship, and vibe with other interns over coffee.',
    location: 'Devocion Williamsburg',
    time: '7:00 PM',
    date: 'Jun 3, 2026',
  },
  {
    id: 'mock-central-park-run',
    title: 'Central Park Run Club',
    description: 'Easy 5k run followed by bagels and coffee.',
    location: 'Central Park, NYC',
    time: '8:00 AM',
    date: 'Jun 5, 2026',
  },
]

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(MOCK_EVENTS)

  useEffect(() => {
    fetch('/api/events')
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
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
