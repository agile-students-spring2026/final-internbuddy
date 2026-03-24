import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { settingsItems } from './settingsData'
import './SettingsDetailPage.css'

function SettingsDetailPage() {
  const navigate = useNavigate()
  const { settingKey } = useParams()

  const section = useMemo(
    () => settingsItems.find((item) => item.key === settingKey && item.details),
    [settingKey],
  )

  if (!section) {
    return (
      <div className="settings-detail-page">
        <div className="settings-detail-header-row">
          <button className="settings-detail-back-btn" onClick={() => navigate('/settings')}>
            Back
          </button>
          <h1 className="settings-detail-title">Settings</h1>
          <div className="settings-detail-header-spacer" />
        </div>

        <div className="settings-detail-card">
          <h2 className="settings-detail-card-title">Section not found</h2>
          <p className="settings-detail-card-text">This settings section is not available in this demo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-detail-page">
      <div className="settings-detail-header-row">
        <button className="settings-detail-back-btn" onClick={() => navigate('/settings')}>
          Back
        </button>
        <h1 className="settings-detail-title">{section.label}</h1>
        <div className="settings-detail-header-spacer" />
      </div>

      <div className="settings-detail-card">
        <h2 className="settings-detail-card-title">Mock Information</h2>
        <p className="settings-detail-card-text">{section.preview}</p>

        <ul className="settings-detail-list">
          {section.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SettingsDetailPage
