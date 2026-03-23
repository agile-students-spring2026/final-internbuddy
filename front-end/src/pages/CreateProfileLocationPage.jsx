import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileLocationPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('address')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 7 of 16</div>
        <h1 className="create-profile-title">Where do you live?</h1>
        <p className="create-profile-subtitle">Your city is shown publicly. Your full address stays private.</p>

        <div className="location-toggle-row">
          <button
            className={`location-toggle-btn${mode === 'address' ? ' active' : ''}`}
            onClick={() => setMode('address')}
          >
            Address
          </button>
          <button
            className={`location-toggle-btn${mode === 'zip' ? ' active' : ''}`}
            onClick={() => setMode('zip')}
          >
            Zip Code
          </button>
        </div>

        {mode === 'address' ? (
          <input
            className="create-profile-input"
            type="text"
            placeholder="123 Main St, City, State"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        ) : (
          <input
            className="create-profile-input"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 10001"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
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
