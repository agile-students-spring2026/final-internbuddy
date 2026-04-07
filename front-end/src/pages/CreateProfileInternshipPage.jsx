import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileInternshipPage() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 11 of 16</div>
        <h1 className="create-profile-title">Internship company</h1>
        <p className="create-profile-subtitle">Enter the company name used in your internship headline.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. Google, Amazon, Stripe..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/job-title')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/friend-preference')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileInternshipPage
