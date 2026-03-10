import { useState } from 'react'
import './LoginPage.css'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login-container">
      <h1>InternBuddy</h1>
      <p>find your people</p>

      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Sign Up / Log In</button>
      <p>Forgot password?</p>
    </div>
  )
}

export default LoginPage