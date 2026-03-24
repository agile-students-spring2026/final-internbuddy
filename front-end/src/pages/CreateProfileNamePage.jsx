import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileNamePage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 5 of 16</div>
        <h1 className="create-profile-title">What is your name?</h1>
        <p className="create-profile-subtitle">Tell us your first and last name.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="create-profile-input"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/dob')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/resume')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileNamePage
