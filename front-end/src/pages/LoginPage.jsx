import { useState } from 'react'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login-container">
      <h1>InternBuddy</h1>
      <p>find your people</p>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Log In</button>
      <p>Forgot password?</p>
    </div>
  )
}

export default LoginPage