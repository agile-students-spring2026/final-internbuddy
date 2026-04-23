import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

function CreateProfileNamePage() {
  const navigate = useNavigate()
  const { onboarding, updateOnboarding } = useProfile()
  const [firstName, setFirstName] = useState(onboarding.firstName || '')
  const [lastName, setLastName] = useState(onboarding.lastName || '')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 5 of 10</div>
        <h1 className="create-profile-title">What name should appear on your card?</h1>
        <p className="create-profile-subtitle">Enter the first and last name shown at the top of your profile.</p>

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

        <button
          className="create-profile-next-btn"
          onClick={() => {
            updateOnboarding({ firstName, lastName })
            navigate('/create-profile/dob')
          }}
        >
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-account/email')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileNamePage
