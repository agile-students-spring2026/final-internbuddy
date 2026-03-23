import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

const GENDERS = [
  'Woman',
  'Man',
  'Non-binary',
  'Genderqueer',
  'Transgender',
  'Gender-fluid',
  'Prefer not to say',
  'Other',
]

function CreateProfileGenderPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 9 of 16</div>
        <h1 className="create-profile-title">Describe your gender</h1>
        <p className="create-profile-subtitle">Choose the option that best fits you.</p>

        <div className="profile-chips-grid">
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`profile-chip${selected === g ? ' selected' : ''}`}
              onClick={() => setSelected(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/friend-preference')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/pronouns')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileGenderPage
