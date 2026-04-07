import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileResumePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // null | 'upload'
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setDone(true)
    }, 2200)
  }

  /* ── Upload sub-screen ───────────────────────────────────── */
  if (mode === 'upload') {
    return (
      <div className="create-profile-page">
        <div className="create-profile-card">
          <div className="create-profile-badge">Step 4 of 9</div>
          <h1 className="create-profile-title">Upload Your Resume</h1>
          <p className="create-profile-subtitle">
            We'll extract your name, school and major headline, internship line, location, and interests.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {!file && !analyzing && !done && (
            <button
              className="resume-upload-area"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="resume-upload-icon">📄</span>
              <span className="resume-upload-label">Tap to upload</span>
              <span className="resume-upload-hint">PDF, Word (.doc / .docx)</span>
            </button>
          )}

          {analyzing && (
            <div className="resume-analyzing">
              <div className="resume-spinner" />
              <p className="resume-analyzing-text">Analyzing your resume…</p>
            </div>
          )}

          {done && (
            <div className="resume-done">
              ✅ Resume analyzed! Your info is ready to review.
            </div>
          )}

          <button
            className="create-profile-next-btn"
            style={{ opacity: done ? 1 : 0.45, cursor: done ? 'pointer' : 'default' }}
            disabled={!done}
            onClick={() => navigate('/create-profile/name')}
          >
            Continue
          </button>

          <button
            className="create-profile-link-btn"
            onClick={() => { setMode(null); setFile(null); setDone(false) }}
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  /* ── Choice screen ───────────────────────────────────────── */
  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 4 of 9</div>
        <h1 className="create-profile-title">Set up your profile</h1>
        <p className="create-profile-subtitle">
          Build your card with name, headline, internship details, about me, and interests.
        </p>

        <button className="resume-option-card" onClick={() => setMode('upload')}>
          <span className="resume-option-icon">📄</span>
          <div className="resume-option-text">
            <div className="resume-option-title">Scan my resume</div>
            <div className="resume-option-desc">
              Upload your resume and we'll fill in your details automatically
            </div>
          </div>
          <span className="resume-option-arrow">›</span>
        </button>

        <button className="resume-option-card" onClick={() => navigate('/create-profile/name')}>
          <span className="resume-option-icon">✏️</span>
          <div className="resume-option-text">
            <div className="resume-option-title">Fill in manually</div>
            <div className="resume-option-desc">
              Enter your details step by step at your own pace
            </div>
          </div>
          <span className="resume-option-arrow">›</span>
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-account/verify')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfileResumePage
