import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileDobPage() {
  const navigate = useNavigate()
  const [dob, setDob] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 6 of 16</div>
        <h1 className="create-profile-title">Date of birth</h1>
        <p className="create-profile-subtitle">Add your birthday.</p>

        <input
          className="create-profile-input"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <p className="create-profile-help">We use this to personalize your experience and keep your account secure.</p>

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/location')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/name')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileDobPage
