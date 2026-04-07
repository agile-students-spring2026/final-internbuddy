import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const OPTIONS = ['Builder', 'Creative', 'Outgoing', 'Curious', 'Collaborative', 'Adventurous']

function CreateProfileLifestylePage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 15 of 16</div>
        <h1 className="create-profile-title">Pick your profile vibe</h1>
        <p className="create-profile-subtitle">Choose one tag that best describes your personality.</p>

        <div className="profile-chips-grid">
          {OPTIONS.map((o) => (
            <button
              key={o}
              className={`profile-chip${selected === o ? ' selected' : ''}`}
              onClick={() => setSelected(o)}
            >
              {o}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/meetup-types')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/degree')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileLifestylePage
