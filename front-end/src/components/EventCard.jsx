import { useState } from 'react'
import './EventCard.css'

function EventCard({ event }) {
  const [joined, setJoined] = useState(false)

  return (
    <div className="event-card">
      <img
        className="event-image"
        src={`https://picsum.photos/seed/${event.id}/400/100`}
        alt="event"
      />
      <p className="event-name">{event.title}</p>
      <p className="event-desc">{event.description}</p>
      <p className="event-location">{event.location}</p>
      <p className="event-time">time {event.time}</p>
      <p className="event-date">date {event.date}</p>
      <button
        className={`event-join-btn ${joined ? 'joined' : ''}`}
        onClick={() => setJoined(!joined)}
      >
        {joined ? 'Joined ✓' : 'Join Meetup'}
      </button>
    </div>
  )
}

export default EventCard