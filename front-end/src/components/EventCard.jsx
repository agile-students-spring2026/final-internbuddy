import { useState } from 'react'
import { getToken, getCurrentUserId } from '../utils/auth'
import './EventCard.css'

function EventCard({ event, onJoin, onLeave }) {
  const currentUserId = getCurrentUserId()
  const isHost = currentUserId && String(event.createdBy) === String(currentUserId)
  const [attendees, setAttendees] = useState(event.attendees || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isJoined = currentUserId && attendees.some(a => String(a) === String(currentUserId))

  const handleJoin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/events/${event.id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to join'); return }
      setAttendees(data.attendees || [])
      onJoin?.(data)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/events/${event.id}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to leave'); return }
      setAttendees(data.attendees || [])
      onLeave?.(data)
    } catch {
      setError('Something went wrong')
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
          onClick={isJoined ? handleLeave : handleJoin}
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
