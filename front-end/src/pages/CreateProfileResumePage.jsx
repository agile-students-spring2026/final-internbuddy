import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileResumePage() {
  const navigate = useNavigate()
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

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <h1 className="create-profile-title">Upload Your Resume (Optional)</h1>
        <p className="create-profile-subtitle">
          Upload your resume to automatically fill in details, or skip to start exploring.
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
          onClick={() => navigate('/swipe')}
        >
          {done ? 'Continue to Swipe' : 'Upload to Continue'}
        </button>

        <button
          className="create-profile-link-btn"
          onClick={() => navigate('/swipe')}
        >
          Skip and Start Exploring
        </button>
      </div>
    </div>
  )
}
}

export default CreateProfileResumePage
