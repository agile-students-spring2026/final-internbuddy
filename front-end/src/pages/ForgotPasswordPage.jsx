import { useState } from 'react'
import './ForgotPasswordPage.css'
import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
  // track form fields
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1 className="forgot-title">InternBuddy</h1>
        <p className="forgot-subtitle">reset your password</p>

        {/* form fields */}
        <input
          className="forgot-input"
          type="text"
          placeholder="Username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <input
          className="forgot-input"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="forgot-button">Confirm Password</button>

        {/* back to login. imo we shld have this in case someone clicks by accident */}
        <Link to="/" className="forgot-link">Back to login</Link>
      </div>
    </div>
  )
}
export default ForgotPasswordPage