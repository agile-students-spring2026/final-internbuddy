import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileSchoolPage() {
  const navigate = useNavigate()
  const [school, setSchool] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 13 of 16</div>
        <h1 className="create-profile-title">Where did you go to school?</h1>
        <p className="create-profile-subtitle">Enter your most recent school or university.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. NYU, MIT, Stanford..."
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/degree')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/job-title')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileSchoolPage
