import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

function CreateProfilePronounsPage() {
  const navigate = useNavigate()
  const { onboarding, updateOnboarding } = useProfile()
  const [headline, setHeadline] = useState(onboarding.headline || '')
  const [internshipLine, setInternshipLine] = useState(onboarding.internshipLine || '')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 7 of 9</div>
        <h1 className="create-profile-title">School and major headline</h1>
        <p className="create-profile-subtitle">Add the two lines shown under your name.</p>

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. CS @ NYU"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />

        <input
          className="create-profile-input"
          type="text"
          placeholder="e.g. SWE Intern @ Amazon"
          value={internshipLine}
          onChange={(e) => setInternshipLine(e.target.value)}
        />

        <button
          className="create-profile-next-btn"
          onClick={() => {
            updateOnboarding({ headline, internshipLine })
            navigate('/create-profile/friend-preference')
          }}
        >
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/dob')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfilePronounsPage
