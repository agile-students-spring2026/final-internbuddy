import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

function CreateProfileFriendPrefPage() {
  const navigate = useNavigate()
  const { onboarding, updateOnboarding } = useProfile()
  const [aboutMe, setAboutMe] = useState(onboarding.about || '')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 8 of 10</div>
        <h1 className="create-profile-title">Write your About me</h1>
        <p className="create-profile-subtitle">Share a short bio that introduces you and what you are looking for.</p>

        <textarea
          className="create-profile-input"
          rows="5"
          placeholder="e.g. I'm a CS student who loves hackathons, open source, and meeting fellow interns in NYC."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />

        <button
          className="create-profile-next-btn"
          onClick={() => {
            updateOnboarding({ about: aboutMe })
            navigate('/create-profile/personality')
          }}
        >
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/pronouns')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileFriendPrefPage
