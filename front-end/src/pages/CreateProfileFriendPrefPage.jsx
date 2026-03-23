import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const PREFS = ['Women', 'Men', 'Non-binary people', 'Everyone']

function CreateProfileFriendPrefPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggle = (p) =>
    setSelected((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 10 of 16</div>
        <h1 className="create-profile-title">Friend gender preference</h1>
        <p className="create-profile-subtitle">Who would you like to meet? Select all that apply.</p>

        <div className="profile-chips-grid">
          {PREFS.map((p) => (
            <button
              key={p}
              className={`profile-chip${selected.includes(p) ? ' selected' : ''}`}
              onClick={() => toggle(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/internship')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/gender')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileFriendPrefPage
