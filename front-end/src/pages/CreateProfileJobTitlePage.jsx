import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileJobTitlePage() {
  const navigate = useNavigate()
  const [jobTitle, setJobTitle] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 12 of 16</div>
        <h1 className="create-profile-title">What's your job title?</h1>
        <p className="create-profile-subtitle">Enter your official or general role.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. Software Engineer Intern"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/school')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/internship')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileJobTitlePage
