import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import './EventsPage.css'
import EventCard from '../components/EventCard'

function EventsPage() {
  const navigate = useNavigate()
  // will come from backend later
  const [events, setEvents] = useState([])

  useEffect(() => {
    // generate fake events for now
    const fakeEvents = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      time: faker.date.soon().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: faker.date.soon().toLocaleDateString(),
    }))
    setEvents(fakeEvents)
  }, [])

  return (
    <div className="events-page">

      {/* top action buttons */}
      <div className="events-top-bar">
        <button className="events-top-btn" onClick={() => navigate('/your-events')}>your events</button>
        <button className="events-top-btn" onClick={() => navigate('/create-events')}>create events</button>
      </div>

      {/* page title */}
      <div className="events-header">
        <h1 className="events-title">Home Page</h1>
        <h2 className="events-subtitle">events near you</h2>
      </div>

      {/* list of events */}
      <div className="events-list">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

    </div>
  )
}

export default EventsPage
