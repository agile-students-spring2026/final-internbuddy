import { useState } from 'react'
import './LoginPage.css'

function LoginPage() {
    // track what the user types in
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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

            <button className="login-button">Sign Up / Log In</button>
            {/* links at the bottom */}
            <p className="login-link">Forgot password?</p>
        </div>
    </div>
  )
}

export default LoginPage