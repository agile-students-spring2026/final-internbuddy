import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

function CreateProfileDobPage() {
  const navigate = useNavigate()
  const { onboarding, updateOnboarding } = useProfile()
  const [startMonth, setStartMonth] = useState(onboarding.startMonth || '')
  const [endMonth, setEndMonth] = useState(onboarding.endMonth || '')
  const [currentInternship, setCurrentInternship] = useState(Boolean(onboarding.currentInternship))
  const [city, setCity] = useState(onboarding.city || '')
  const [stateCode, setStateCode] = useState(onboarding.stateCode || '')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 6 of 10</div>
        <h1 className="create-profile-title">Internship timeline</h1>
        <p className="create-profile-subtitle">Add internship dates and your location for the profile card summary line.</p>

        <input
          className="create-profile-input"
          type={startMonth ? 'month' : 'text'}
          placeholder="Start month (e.g. May 2026)"
          value={startMonth}
          onFocus={(e) => { e.target.type = 'month' }}
          onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
          onChange={(e) => setStartMonth(e.target.value)}
        />

        <label className="create-profile-checkbox-row">
          <input
            type="checkbox"
            checked={currentInternship}
            onChange={(e) => {
              const isCurrent = e.target.checked
              setCurrentInternship(isCurrent)
              if (isCurrent) {
                setEndMonth('')
              }
            }}
          />
          <span>Current internship</span>
        </label>

        {!currentInternship && (
          <input
            className="create-profile-input"
            type={endMonth ? 'month' : 'text'}
            placeholder="End month (e.g. Aug 2026)"
            value={endMonth}
            onFocus={(e) => { e.target.type = 'month' }}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
            onChange={(e) => setEndMonth(e.target.value)}
          />
        )}

        <input
          className="create-profile-input"
          type="text"
          placeholder="City (e.g. NYC)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="create-profile-input"
          type="text"
          placeholder="State (e.g. NY)"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
        />

        <p className="create-profile-help">This appears beside your location on the profile card.</p>

        <button
          className="create-profile-next-btn"
          onClick={() => {
            updateOnboarding({
              startMonth,
              endMonth: currentInternship ? '' : endMonth,
              currentInternship,
              city,
              stateCode,
            })
            navigate('/create-profile/pronouns')
          }}
        >
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
