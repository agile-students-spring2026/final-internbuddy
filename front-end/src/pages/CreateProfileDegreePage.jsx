import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const DEGREES = [
  'High School',
  "Associate's",
  "Bachelor's",
  "Master's",
  'PhD',
  'Other',
]

function CreateProfileDegreePage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 14 of 16</div>
        <h1 className="create-profile-title">Highest degree</h1>
        <p className="create-profile-subtitle">What's your highest level of education?</p>

        <div className="profile-chips-grid">
          {DEGREES.map((d) => (
            <button
              key={d}
              className={`profile-chip${selected === d ? ' selected' : ''}`}
              onClick={() => setSelected(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/lifestyle')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/school')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileDegreePage
