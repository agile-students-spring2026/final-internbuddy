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
  const { onboarding, account, updateOnboarding } = useProfile()
  const [selected, setSelected] = useState(onboarding.interests || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )
    setError('')
  }

  const handleFinish = async () => {
    try {
      setLoading(true)
      setError('')

      const nextOnboarding = { ...onboarding, interests: selected }
      updateOnboarding({ interests: selected })

      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to finish onboarding.')
        setLoading(false)
        return
      }

      const payload = {
        name: `${nextOnboarding.firstName || ''} ${nextOnboarding.lastName || ''}`.trim(),
        city: nextOnboarding.city || '',
        location: nextOnboarding.stateCode || '',
        internship: nextOnboarding.internshipLine || '',
        major: nextOnboarding.major || '',
        personality: nextOnboarding.personality || '',
        interests: nextOnboarding.interests || [],
        about: nextOnboarding.about || '',
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error(data)
        setError(data.error || 'Failed to save profile')
        setLoading(false)
        return
      }

      // Navigate to optional resume upload page after profile is saved
      navigate('/create-profile/resume-upload')
    } catch (err) {
      console.error(err)
      setError('Something went wrong while saving your profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 10 of 10</div>
        <h1 className="create-profile-title">Choose your interests</h1>
        <p className="create-profile-subtitle">
          Pick the interests you want to show in your profile card.
        </p>

        <div className="profile-chips-grid">
          {MEETUP_TYPES.map(({ emoji, label }) => (
            <button
              key={label}
              type="button"
              className={`profile-chip meetup-chip${selected.includes(label) ? ' selected' : ''}`}
              onClick={() => toggle(label)}
            >
              <span className="meetup-chip-emoji">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="create-profile-next-btn"
          onClick={handleFinish}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Resume (Optional)'}
        </button>

        <button
          className="create-profile-link-btn"
          onClick={() => navigate('/create-profile/personality')}
          disabled={loading}
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileMeetupPage