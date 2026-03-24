import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const MEETUP_TYPES = [
  { emoji: '🏀', label: 'Sports' },
  { emoji: '🍜', label: 'Food' },
  { emoji: '🎨', label: 'Creation' },
  { emoji: '🍹', label: 'Drinks' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '📚', label: 'Reading' },
  { emoji: '🎵', label: 'Music' },
]

function CreateProfileMeetupPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggle = (label) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 16 of 16</div>
        <h1 className="create-profile-title">Meetup preferences</h1>
        <p className="create-profile-subtitle">What kinds of hangouts are you into? Pick as many as you like.</p>

        <div className="profile-chips-grid">
          {MEETUP_TYPES.map(({ emoji, label }) => (
            <button
              key={label}
              className={`profile-chip meetup-chip${selected.includes(label) ? ' selected' : ''}`}
              onClick={() => toggle(label)}
            >
              <span className="meetup-chip-emoji">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/events')}>
          Let's go! 🎉
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/lifestyle')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileMeetupPage
