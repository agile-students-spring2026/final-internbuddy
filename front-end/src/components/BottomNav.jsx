import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConnectionsContext } from '../context/ConnectionsContext'
import './BottomNav.css'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pending } = useContext(ConnectionsContext)
  const pendingCount = pending?.length || 0

  const pathname = location.pathname
  
  if (
    pathname === '/' ||
    pathname.startsWith('/create-account') ||
    pathname.startsWith('/create-profile')
  ) {
    return null
  }

  const currentTab = pathname.startsWith('/profile')
    ? 'profile'
    : pathname.startsWith('/events')
      ? 'home'
      : pathname.startsWith('/search')
        ? 'search'
        : pathname.startsWith('/messages')
          ? 'messages'
          : ''

  return (
    <nav className="global-bottom-nav" aria-label="Primary">
      <button
        className={`global-nav-btn ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => navigate('/events')}
      >
        Home
      </button>
      <button
        className={`global-nav-btn ${currentTab === 'search' ? 'active' : ''}`}
        onClick={() => navigate('/search')}
      >
        Search
      </button>
      <button
        className={`global-nav-btn ${currentTab === 'messages' ? 'active' : ''}`}
        onClick={() => navigate('/messages')}
      >
        Messages
      </button>
      <button
        className={`global-nav-btn ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
        style={{ position: 'relative' }}
      >
        Profile
        {pendingCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '8px',
            background: '#e53e3e',
            color: '#fff',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>
    </nav>
  )
}

export default BottomNav