import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateAccountFlow.css'

const countryCodes = ['+1', '+44', '+61', '+81', '+91', '+971']

function CreateAccountPhonePage() {
  const navigate = useNavigate()
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <h1 className="create-account-title">Phone Number</h1>
        <p className="create-account-subtitle">Step 2 of 2: Add your phone number</p>

        <div className="phone-row">
          <input
            className="create-account-input phone-input"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <select
            className="country-code-select"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            aria-label="Country code"
          >
            {countryCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="phone-help-links">
          <button className="help-link-btn" type="button">What if my number changes?</button>
          <button className="help-link-btn" type="button">Other verification methods</button>
        </div>

        <button className="create-account-next-btn" onClick={() => navigate('/create-account/verify')}>
          Next
        </button>

        <button className="create-account-link-btn" onClick={() => navigate('/create-account/email')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateAccountPhonePage
