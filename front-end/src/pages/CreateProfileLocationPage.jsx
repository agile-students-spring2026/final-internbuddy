import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileLocationPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('city')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 7 of 16</div>
        <h1 className="create-profile-title">Where are you based?</h1>
        <p className="create-profile-subtitle">This powers the location tag on your card, like NYC.</p>

        <div className="location-toggle-row">
          <button
            className={`location-toggle-btn${mode === 'city' ? ' active' : ''}`}
            onClick={() => setMode('city')}
          >
            City
          </button>
          <button
            className={`location-toggle-btn${mode === 'state' ? ' active' : ''}`}
            onClick={() => setMode('state')}
          >
            State
          </button>
        </div>

        {mode === 'city' ? (
          <input
            className="create-profile-input"
            type="text"
            placeholder="e.g. New York City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        ) : (
          <input
            className="create-profile-input"
            type="text"
            placeholder="e.g. NY"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
          />
        )}

        <button className="create-profile-next-btn" onClick={() => navigate('/create-profile/pronouns')}>
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/dob')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileLocationPage
