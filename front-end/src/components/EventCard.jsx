import { useContext, useState } from 'react'
import { EventsContext } from '../context/EventsContext'
import { getCurrentUserId } from '../utils/auth'
import './EventCard.css'

function EventCard({ event }) {
  const { joinEvent, leaveEvent } = useContext(EventsContext)
  const currentUserId = getCurrentUserId()
  const isHost = currentUserId && String(event.createdBy) === String(currentUserId)
  const isJoined = currentUserId && (event.attendees || []).some(a => String(a) === String(currentUserId))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      if (isJoined) await leaveEvent(event.id)
      else await joinEvent(event.id)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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
      {!isHost && (
        <button
          className={`event-join-btn ${isJoined ? 'joined' : ''}`}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? '…' : isJoined ? 'Joined ✓' : 'Join Meetup'}
        </button>
      )}
      {error && <p className="event-error">{error}</p>}
    </div>
  )
}

export default EventCard
