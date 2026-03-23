import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateAccountVerifyPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])

  const handleDigit = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value && index < 5) {
      document.getElementById(`verify-box-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`verify-box-${index - 1}`)?.focus()
    }
  }

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 3 of 15</div>
        <h1 className="create-profile-title">Enter the code</h1>
        <p className="create-profile-subtitle">We texted a 6-digit verification code to your phone number.</p>

        <div className="verify-code-row">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`verify-box-${i}`}
              className="verify-box"
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <button className="verify-resend-btn" type="button">Resend code</button>

        <button
          className="create-profile-next-btn"
          onClick={() => navigate('/create-profile/resume')}
        >
          Verify
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-account/phone')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateAccountVerifyPage
