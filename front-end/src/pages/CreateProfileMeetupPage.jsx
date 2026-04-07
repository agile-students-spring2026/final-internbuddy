import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

const MEETUP_TYPES = [
  { emoji: '🎾', label: 'Tennis' },
  { emoji: '☕', label: 'Cafes' },
  { emoji: '🎵', label: 'Concerts' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '📷', label: 'Photography' },
  { emoji: '✈', label: 'Travel' },
  { emoji: '💻', label: 'Hackathons' },
]

function CreateProfileMeetupPage() {
  const navigate = useNavigate()
  const { onboarding, updateOnboarding } = useProfile()
  const [selected, setSelected] = useState(onboarding.interests || [])

  const toggle = (label) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 9 of 9</div>
        <h1 className="create-profile-title">Choose your interests</h1>
        <p className="create-profile-subtitle">Pick the interests you want to show in your profile card.</p>

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

        <button
          className="create-profile-next-btn"
          onClick={() => {
            updateOnboarding({ interests: selected })
            navigate('/profile')
          }}
        >
          Let's go! 🎉
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/friend-preference')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileMeetupPage
