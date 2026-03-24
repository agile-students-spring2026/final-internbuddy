import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = location.pathname.startsWith('/profile')
    ? 'profile'
    : location.pathname.startsWith('/events')
      ? 'home'
      : location.pathname.startsWith('/swipe')
        ? 'swipe'
        : location.pathname.startsWith('/messages')
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
        className={`global-nav-btn ${currentTab === 'swipe' ? 'active' : ''}`}
        onClick={() => navigate('/swipe')}
      >
        Swipe
      </button>
      <button
        className="global-nav-btn"
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
      >
        Profile
      </button>
    </nav>
  )
}

export default BottomNav