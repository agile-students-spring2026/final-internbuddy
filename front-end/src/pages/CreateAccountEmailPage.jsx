import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateAccountFlow.css'

function CreateAccountEmailPage() {
  const navigate = useNavigate()
  const { account, updateAccount } = useProfile()

  const [email, setEmail] = useState(account.email || '')
  const [password, setPassword] = useState(account.password || '')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!confirmPassword) {
      setError('Please confirm your password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    updateAccount({
      email: email.trim(),
      password,
    })
    navigate('/create-account/phone')
  }

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <h1 className="create-account-title">Create Account</h1>
        <p className="create-account-subtitle">
          Step 1 of 2: Enter your email and create a password
        </p>

        <input
          className="create-account-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
        />

        <input
          className="create-account-input"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
        />

        <input
          className="create-account-input"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setError('')
          }}
        />


        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        <button
          className="create-account-next-btn mt-4"
          onClick={handleNext}
        >
          Next
        </button>

        <button
          className="create-account-link-btn"
          onClick={() => navigate('/')}
        >
          Back to login
        </button>
      </div>
    </div>
  )
}

export default CreateAccountEmailPage