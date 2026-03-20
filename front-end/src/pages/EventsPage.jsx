import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventsContext } from '../context/EventsContext'
import './EventsPage.css'
import EventCard from '../components/EventCard'

function EventsPage() {
  const navigate = useNavigate()
  const { events } = useContext(EventsContext)

  return (
    <div className="events-page">
      <div className="events-top-bar">
        <button className="events-top-btn" onClick={() => navigate('/your-events')}>your events</button>
        <button className="events-top-btn" onClick={() => navigate('/create-events')}>create events</button>
      </div>

      <div className="events-header">
        <h1 className="events-title">Home Page</h1>
        <h2 className="events-subtitle">events near you</h2>
      </div>

      <div className="events-list">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default EventsPage