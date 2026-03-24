import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const PRONOUNS = [
  'she/her',
  'he/him',
  'they/them',
  'she/they',
  'he/they',
  'ze/zir',
  'prefer not to say',
]

function CreateProfilePronounsPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggle = (p) =>
    setSelected((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 8 of 16</div>
        <h1 className="create-profile-title">What are your pronouns?</h1>
        <p className="create-profile-subtitle">Select all that apply. Displayed on your profile.</p>

        <div className="profile-chips-grid">
          {PRONOUNS.map((p) => (
            <button
              key={p}
              className={`profile-chip${selected.includes(p) ? ' selected' : ''}`}
              onClick={() => toggle(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/gender')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/location')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfilePronounsPage
