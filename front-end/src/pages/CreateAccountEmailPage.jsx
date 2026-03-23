import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateAccountFlow.css'

function CreateAccountEmailPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <h1 className="create-account-title">Create Account</h1>
        <p className="create-account-subtitle">Step 1 of 2: Enter your email</p>

        <input
          className="create-account-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="create-account-next-btn" onClick={() => navigate('/create-account/phone')}>
          Next
        </button>

        <button className="create-account-link-btn" onClick={() => navigate('/')}>
          Back to login
        </button>
      </div>
    </div>
  )
}

export default CreateAccountEmailPage
