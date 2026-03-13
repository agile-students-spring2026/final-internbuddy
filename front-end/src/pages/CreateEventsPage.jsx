import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateEventsPage.css'

function CreateEventsPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('Sunset Picnic Meetup')
  const [description, setDescription] = useState('Bring snacks, a blanket, and meet other interns for a relaxed evening in the park.')
  const [location, setLocation] = useState('Bryant Park')
  const [date, setDate] = useState('2026-06-20')
  const [time, setTime] = useState('18:30')
  const [privacy, setPrivacy] = useState('Public')

  return (
    <div className="create-events-page">
      <div className="events-top-bar">
        <button className="events-top-btn" onClick={() => navigate('/your-events')}>your events</button>
        <button className="events-top-btn create-events-top-btn-active">create events</button>
      </div>

      <div className="events-header create-events-header">
        <h1 className="events-title">Create Event</h1>
        <h2 className="events-subtitle">plan something people will join</h2>
      </div>

      <div className="create-events-content">
        <section className="create-events-card">
          <p className="create-events-section-label">Event Details</p>

          <label className="create-events-label">Title</label>
          <input
            className="create-events-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Event title"
          />

          <label className="create-events-label">Description</label>
          <textarea
            className="create-events-input create-events-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this event about?"
          />

          <label className="create-events-label">Location</label>
          <input
            className="create-events-input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
          />

          <div className="create-events-row">
            <div className="create-events-field">
              <label className="create-events-label">Date</label>
              <input
                className="create-events-input"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="create-events-field">
              <label className="create-events-label">Time</label>
              <input
                className="create-events-input"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
          </div>

          <label className="create-events-label">Privacy</label>
          <div className="create-events-privacy-row">
            {['Public', 'Private'].map((option) => (
              <button
                key={option}
                className={`create-events-privacy-btn ${privacy === option ? 'active' : ''}`}
                onClick={() => setPrivacy(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button className="create-events-submit-btn">Create Event</button>
        </section>

        <section className="create-events-card">
          <p className="create-events-section-label">Preview</p>
          <div className="create-events-preview">
            <div className="create-events-preview-badge">{privacy}</div>
            <p className="create-events-preview-title">{title || 'Your event title'}</p>
            <p className="create-events-preview-desc">{description || 'Your event description will show here.'}</p>
            <p className="create-events-preview-meta">{location || 'Location'} | {date || 'Date'} | {time || 'Time'}</p>
          </div>
        </section>
      </div>

      <div className="events-bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/events')}>Home</button>
        <button className="nav-btn">Search</button>
        <button className="nav-btn" onClick={() => navigate('/profile')}>Profile</button>
      </div>
    </div>
  )
}

export default CreateEventsPage