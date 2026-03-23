import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { accountCenterItems } from './accountCenterData'
import './AccountCenterDetailPage.css'

function AccountCenterDetailPage() {
  const navigate = useNavigate()
  const { sectionKey } = useParams()

  const section = useMemo(
    () => accountCenterItems.find((item) => item.key === sectionKey),
    [sectionKey],
  )

  if (!section) {
    return (
      <div className="account-center-detail-page">
        <div className="account-center-detail-header-row">
          <button className="account-center-detail-back-btn" onClick={() => navigate('/account-center')}>
            Back
          </button>
          <h1 className="account-center-detail-title">Account Center</h1>
          <div className="account-center-detail-header-spacer" />
        </div>

        <div className="account-center-detail-card">
          <h2 className="account-center-detail-card-title">Section not found</h2>
          <p className="account-center-detail-card-text">That option is not available in this demo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="account-center-detail-page">
      <div className="account-center-detail-header-row">
        <button className="account-center-detail-back-btn" onClick={() => navigate('/account-center')}>
          Back
        </button>
        <h1 className="account-center-detail-title">{section.title}</h1>
        <div className="account-center-detail-header-spacer" />
      </div>

      <div className="account-center-detail-card">
        <h2 className="account-center-detail-card-title">Mock Information</h2>
        <p className="account-center-detail-card-text">{section.preview}</p>

        <ul className="account-center-detail-list">
          {section.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AccountCenterDetailPage
