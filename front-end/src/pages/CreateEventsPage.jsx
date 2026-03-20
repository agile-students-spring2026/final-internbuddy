import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventsContext } from '../context/EventsContext'
import './CreateEventsPage.css'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  privacy: 'public',
}

export default function CreateEventsPage() {
  const navigate = useNavigate()
  const { addEvent } = useContext(EventsContext)
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addEvent(form)
    navigate('/events')
  }

  return (
    <div className="create-page">
      <div className="create-header">
        <button className="create-back-btn" onClick={() => navigate('/events')}>← back</button>
        <h1 className="create-title">Create Event</h1>
      </div>

      {form.title && (
        <div className="create-preview-card">
          <p className="preview-title">{form.title}</p>
          {form.description && <p className="preview-desc">{form.description}</p>}
          <div className="preview-meta">
            {form.location && <span>{form.location}</span>}
            {form.date && <span>{form.date}</span>}
            {form.time && <span>{form.time}</span>}
            <span>{form.privacy === 'private' ? 'Private' : 'Public'}</span>
          </div>
        </div>
      )}

      <form className="create-form" onSubmit={handleSubmit}>
        <label className="create-label">
          Event Title *
          <input className="create-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Sushi Night" required />
        </label>

        <label className="create-label">
          Description
          <textarea className="create-input create-textarea" name="description" value={form.description} onChange={handleChange} placeholder="What's the vibe?" rows={3} />
        </label>

        <label className="create-label">
          Location
          <input className="create-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Noho, NYC" />
        </label>

        <div className="create-row">
          <label className="create-label half">
            Date
            <input className="create-input" type="date" name="date" value={form.date} onChange={handleChange} />
          </label>
          <label className="create-label half">
            Time
            <input className="create-input" type="time" name="time" value={form.time} onChange={handleChange} />
          </label>
        </div>

        <label className="create-label">
          Privacy
          <select className="create-input" name="privacy" value={form.privacy} onChange={handleChange}>
            <option value="public">Public</option>
            <option value="private">Private (friends only)</option>
          </select>
        </label>

        <button type="submit" className="create-submit-btn">Create Event</button>
      </form>
    </div>
  )
}
