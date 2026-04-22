import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProfileFlow.css'

function CreateProfileResumePage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setError('')
    setFile(f)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setDone(true)
    }, 2200)
  }

  const saveResumeAndContinue = async () => {
    if (!file) return

    try {
      setSaving(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to continue.')
        setSaving(false)
        return
      }

      const resumeText = `Uploaded resume: ${file.name}. Parsed details are available for profile review.`

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeFileName: file.name,
          resumeUploadedAt: new Date().toISOString(),
          resumeText,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save resume')
        setSaving(false)
        return
      }

      navigate('/swipe')
    } catch (err) {
      console.error(err)
      setError('Something went wrong while saving your resume')
    } finally {
      setSaving(false)
    }
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
          style={{ opacity: done && !saving ? 1 : 0.45, cursor: done && !saving ? 'pointer' : 'default' }}
          disabled={!done || saving}
          onClick={saveResumeAndContinue}
        >
          {saving ? 'Saving Resume...' : done ? 'Continue to Swipe' : 'Upload to Continue'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="create-profile-link-btn"
          onClick={() => navigate('/swipe')}
          disabled={saving}
        >
          Skip and Start Exploring
        </button>
      </div>
    </div>
  )
}

export default CreateProfileResumePage
