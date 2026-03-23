import { useNavigate } from 'react-router-dom'
import { accountCenterItems } from './accountCenterData'
import './AccountCenterPage.css'

function AccountCenterPage() {
  const navigate = useNavigate()

  return (
    <div className="account-center-page">
      <div className="account-center-header-row">
        <button className="account-center-back-btn" onClick={() => navigate('/settings')}>
          Back
        </button>
        <h1 className="account-center-title">Account Center</h1>
        <div className="account-center-header-spacer" />
      </div>

      <div className="account-center-list">
        {accountCenterItems.map((item) => (
          <button
            key={item.key}
            className="account-center-item-btn"
            type="button"
            onClick={() => navigate(`/account-center/${item.key}`)}
          >
            <span className="account-center-item-text-wrap">
              <span className="account-center-item-title">{item.title}</span>
              <span className="account-center-item-preview">{item.preview}</span>
            </span>
            <span className="account-center-item-arrow">&gt;</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AccountCenterPage
