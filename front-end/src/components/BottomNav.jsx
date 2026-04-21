import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

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
      >
        Profile
      </button>
    </nav>
  )
}

export default BottomNav