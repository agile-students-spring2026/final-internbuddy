import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

function buildDateRange(startMonth, endMonth, currentInternship) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const fmt = (value) => {
    if (!value) return ''
    const [year, month] = value.split('-')
    return `${monthNames[Number(month) - 1] || ''} ${year}`.trim()
  }

  if (currentInternship && startMonth) return `${fmt(startMonth)} - Present`
  if (startMonth && endMonth) {
    const [sy, sm] = startMonth.split('-')
    const [ey, em] = endMonth.split('-')
    if (sy === ey) return `${monthNames[Number(sm) - 1]} - ${monthNames[Number(em) - 1]} ${ey}`
    return `${fmt(startMonth)} - ${fmt(endMonth)}`
  }
  return fmt(startMonth || endMonth)
}

function buildPayload(onboarding, resumeFields) {
  const fullName = `${onboarding.firstName} ${onboarding.lastName}`.trim()
  const dateRange = buildDateRange(onboarding.startMonth, onboarding.endMonth, onboarding.currentInternship)
  const cityLabel = [onboarding.city, onboarding.stateCode].filter(Boolean).join(', ')
  const locationParts = [cityLabel, dateRange].filter(Boolean)

  const internship =
    onboarding.internshipHeadline ||
    ([onboarding.jobTitle, onboarding.company].filter(Boolean).join(' @ ')) ||
    onboarding.internshipLine ||
    ''

  return {
    name: fullName || undefined,
    internship: internship || undefined,
    jobTitle: onboarding.jobTitle || undefined,
    company: onboarding.company || undefined,
    school: onboarding.school || undefined,
    degree: onboarding.degree || undefined,
    major: onboarding.major || onboarding.headline || undefined,
    city: cityLabel || undefined,
    location: locationParts.join(' | ') || undefined,
    lifestyle: onboarding.lifestyle || undefined,
    about: onboarding.about || undefined,
    interests: onboarding.interests?.length ? onboarding.interests : undefined,
    personality: onboarding.personality || undefined,
    ...resumeFields,
  }
}

function CreateProfileResumePage() {
  const navigate = useNavigate()
  const { onboarding } = useProfile()
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

  const saveProfile = async (resumeFields = {}) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to continue.')
      return false
    }

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(buildPayload(onboarding, resumeFields)),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to save profile')
      return false
    }

    return true
  }

  const saveResumeAndContinue = async () => {
    if (!file) return
    try {
      setSaving(true)
      setError('')
      const ok = await saveProfile({
        resumeFileName: file.name,
        resumeUploadedAt: new Date().toISOString(),
        resumeText: `Uploaded resume: ${file.name}.`,
      })
      if (ok) navigate('/swipe')
    } catch (err) {
      console.error(err)
      setError('Something went wrong while saving your profile')
    } finally {
      setSaving(false)
    }
  }

  const skipAndContinue = async () => {
    try {
      setSaving(true)
      setError('')
      const ok = await saveProfile()
      if (ok) navigate('/swipe')
    } catch (err) {
      console.error(err)
      setError('Something went wrong while saving your profile')
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
          {saving ? 'Saving…' : done ? 'Continue to Swipe' : 'Upload to Continue'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="create-profile-link-btn"
          onClick={skipAndContinue}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Skip and Start Exploring'}
        </button>
      </div>
    </div>
  )
}

export default CreateProfileResumePage
