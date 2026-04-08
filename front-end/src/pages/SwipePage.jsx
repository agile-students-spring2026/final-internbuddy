import { useState, useEffect } from 'react'
import './SwipePage.css'

function SwipePage() {
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [notification, setNotification] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [requestsTab, setRequestsTab] = useState('received')

  useEffect(() => {
    fetch('/api/swipe/profiles')
      .then(res => res.json())
      .then(data => setProfiles(data))
      .catch(err => console.error('Failed to fetch profiles:', err))

    fetch('/api/swipe/requests')
      .then(res => res.json())
      .then(data => setReceivedRequests(data.received || []))
      .catch(err => console.error('Failed to fetch requests:', err))
  }, [])

  const profile = profiles[currentIndex]

  const handleReject = () => {
    setSwipeDirection('left')
    fetch('/api/swipe/pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id }),
    }).catch(err => console.error('Failed to pass:', err))

    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setNotification(null)
      } else {
        setNotification({ type: 'info', text: "No more profiles — check back soon!" })
      }
      setSwipeDirection(null)
    }, 500)
  }

  const handleAccept = () => {
    setSwipeDirection('right')
    setSentRequests([...sentRequests, profile.name])
    setNotification({ type: 'success', text: `✓ Friend request sent to ${profile.name}!` })

    fetch('/api/swipe/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id }),
    }).catch(err => console.error('Failed to like:', err))

    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setNotification(null)
      } else {
        setNotification({ type: 'info', text: "No more profiles — check back soon!" })
      }
      setSwipeDirection(null)
    }, 1600)
  }

  return (
    <div className="swipe-page">
      <div className="swipe-top-bar">
        <button className="swipe-heart-btn" onClick={() => setShowRequests(true)}>
          ❤️
          {(sentRequests.length + receivedRequests.length) > 0 && (
            <span className="swipe-heart-badge">
              {sentRequests.length + receivedRequests.length}
            </span>
          )}
        </button>
      </div>

      {notification && (
        <div className={`swipe-notification swipe-notification-${notification.type}`}>
          {notification.text}
        </div>
      )}

      {profile && (
        <div className="swipe-card-wrapper">
          <div className={`swipe-card-container ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
            <div className="swipe-card">
              <img className="swipe-image" src={profile.image} alt={profile.name} />
            </div>

            <div className="swipe-info-section">
              <h1 className="swipe-name">
                {profile.name}, <span className="swipe-age">{profile.age}</span>
              </h1>
              <p className="swipe-major">{profile.major}</p>
              <p className="swipe-internship">{profile.internshipFull}</p>
              <p className="swipe-location">{profile.locationFull}</p>

              <p className="swipe-about">{profile.about}</p>

              <div className="swipe-details">
                <div className="swipe-detail-row">
                  <span className="swipe-detail-label">Pronouns:</span>
                  <span className="swipe-detail-value">{profile.pronouns}</span>
                </div>
                <div className="swipe-detail-row">
                  <span className="swipe-detail-label">Drinks:</span>
                  <span className="swipe-detail-value">{profile.drinks}</span>
                </div>
              </div>

              <div className="swipe-interests">
                <p className="swipe-interests-label">Interests</p>
                <div className="swipe-chips">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="swipe-chip">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="swipe-actions">
            <button className="swipe-reject-btn" onClick={handleReject}>
              ✕
            </button>
            <button className="swipe-accept-btn" onClick={handleAccept}>
              ✓
            </button>
          </div>
        </div>
      )}

      {showRequests && (
        <div className="swipe-requests-overlay">
          <div className="swipe-requests-modal">
            <div className="swipe-requests-header">
              <h2>Friend Requests</h2>
              <button
                className="swipe-requests-close"
                onClick={() => setShowRequests(false)}
              >
                ✕
              </button>
            </div>

            <div className="swipe-requests-tabs">
              <button
                className={`swipe-requests-tab ${
                  requestsTab === 'received' ? 'active' : ''
                }`}
                onClick={() => setRequestsTab('received')}
              >
                Received ({receivedRequests.length})
              </button>
              <button
                className={`swipe-requests-tab ${
                  requestsTab === 'sent' ? 'active' : ''
                }`}
                onClick={() => setRequestsTab('sent')}
              >
                Sent ({sentRequests.length})
              </button>
            </div>

            <div className="swipe-requests-list">
              {requestsTab === 'received' &&
                (receivedRequests.length > 0 ? (
                  receivedRequests.map((req) => (
                    <div key={req.id} className="swipe-request-item">
                      <img
                        src={req.image}
                        alt={req.name}
                        className="swipe-request-image"
                      />
                      <div className="swipe-request-info">
                        <h3>{req.name}</h3>
                        <p>{req.role}</p>
                      </div>
                      <div className="swipe-request-actions">
                        <button className="swipe-request-accept">✓</button>
                        <button className="swipe-request-reject">✕</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="swipe-requests-empty">No received requests</p>
                ))}

              {requestsTab === 'sent' &&
                (sentRequests.length > 0 ? (
                  sentRequests.map((name, index) => (
                    <div key={index} className="swipe-sent-request-item">
                      <div className="swipe-sent-request-info">
                        <h3>{name}</h3>
                        <p>Request sent</p>
                      </div>
                      <span className="swipe-sent-request-badge">⏳</span>
                    </div>
                  ))
                ) : (
                  <p className="swipe-requests-empty">No sent requests</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SwipePage
