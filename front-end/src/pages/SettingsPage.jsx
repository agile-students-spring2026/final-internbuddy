import { useNavigate } from 'react-router-dom'
import { settingsItems } from './settingsData'
import './SettingsPage.css'

function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="settings-page">
      <div className="settings-header-row">
        <button className="settings-back-btn" onClick={() => navigate('/profile')}>
          Back
        </button>
        <h1 className="settings-title">Settings</h1>
        <div className="settings-header-spacer" />
      </div>

      <div className="settings-list">
        {settingsItems.map((item) => (
          <button
            key={item.key}
            className="settings-item-btn"
            type="button"
            onClick={() => navigate(item.route)}
          >
            <span>{item.label}</span>
            <span className="settings-item-arrow">&gt;</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsPage
