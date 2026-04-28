import { useState } from 'react'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.error || 'Login failed');
        return;
      }

      // store token
      localStorage.setItem('token', data.token);

      console.log('TOKEN SAVED:', data.token);

      // redirect
      if (data.user?.onboardingCompleted) {
        navigate('/events');
      } else {
        navigate('/create-profile/name');
      }

    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-actions">
          <button className="login-button" onClick={handleLogin}>
            Log In
          </button>
          <button className="signup-button" onClick={handleSignUp}>
            Create an Account
          </button>
        </div>

        <p className="login-fine-print">
          By tapping Sign In or Create Account, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  )
}

export default LoginPage