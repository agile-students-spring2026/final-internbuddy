import { useEffect, useState } from 'react'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [restoringSession, setRestoringSession] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setRestoringSession(false)
        return
      }

      try {
        const authRes = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!authRes.ok) {
          localStorage.removeItem('token')
          setRestoringSession(false)
          return
        }

        const profileRes = await fetch('/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileRes.ok) {
          navigate('/events', { replace: true })
          return
        }

        navigate('/create-profile/name', { replace: true })
      } catch (err) {
        console.error(err)
        setRestoringSession(false)
      }
    }

    restoreSession()
  }, [navigate])

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



      // Redirect based on actual profile existence, not only onboarding flag.
      const profileRes = await fetch('/api/profile/me', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (profileRes.ok) {
        navigate('/events');
        return;
      }

      navigate('/create-profile/name');

    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  }

  const handleSignUp = () => {
    navigate('/create-account/email')
  }

  if (restoringSession) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">InternBuddy</h1>
          <p className="login-subtitle">restoring your session...</p>
        </div>
      </div>
    )
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