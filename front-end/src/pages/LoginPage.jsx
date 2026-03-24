import { useState } from 'react'
import './LoginPage.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    // track what the user types in
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/events')
  }

  const handleSignUp = () => {
    navigate('/create-account/email')
  }

  return (
    <div className="login-container">
        <div className="login-card">
            <h1 className="login-title">InternBuddy</h1>
            <p className="login-subtitle">find your people</p>

            <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-actions">
              <button className="login-button" onClick={handleLogin}>Log In</button>
              <button className="signup-button" onClick={handleSignUp}>Create an Account</button>
            </div>

            <p className="login-fine-print">
              By tapping Sign In or Create Account, you agree to our Terms of Service. Learn how we process your data in our Privacy Policy and Cookies Policy.
            </p>
            {/* links at the bottom */}
            <Link to="/forgot-password" className="login-link">Forgot password?</Link>
        </div>
    </div>
  )
}

export default LoginPage