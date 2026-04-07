import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileGenderPage() {
  const navigate = useNavigate()
  const [internshipHeadline, setInternshipHeadline] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 9 of 16</div>
        <h1 className="create-profile-title">Internship headline</h1>
        <p className="create-profile-subtitle">Enter the second line under your name, for example SWE Intern @ Amazon.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. SWE Intern @ Amazon"
          value={internshipHeadline}
          onChange={(e) => setInternshipHeadline(e.target.value)}
        />

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
