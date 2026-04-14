import { useState, useEffect, useContext } from 'react'
import { ConnectionsContext } from '../context/ConnectionsContext'
import './SwipePage.css'

function SwipePage() {
  const { pending, sent, sendRequest, acceptRequest, rejectRequest } = useContext(ConnectionsContext)
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [notification, setNotification] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [showRequests, setShowRequests] = useState(false)
  const [requestsTab, setRequestsTab] = useState('received')

  useEffect(() => {
    fetch('/api/swipe/profiles')
      .then(res => res.json())
      .then(data => setProfiles(data))
      .catch(err => console.error('Failed to fetch profiles:', err))
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
    setNotification({ type: 'success', text: `✓ Friend request sent to ${profile.name}!` })

    sendRequest(String(profile.id))
      .catch(err => console.error('Failed to send request:', err))

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
          {(sent.length + pending.length) > 0 && (
            <span className="swipe-heart-badge">
              {sent.length + pending.length}
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
              <img className="swipe-image" src={profile.swipeImage || profile.image} alt={profile.name} />
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
                Received ({pending.length})
              </button>
              <button
                className={`swipe-requests-tab ${
                  requestsTab === 'sent' ? 'active' : ''
                }`}
                onClick={() => setRequestsTab('sent')}
              >
                Sent ({sent.length})
              </button>
            </div>

            <div className="swipe-requests-list">
              {requestsTab === 'received' &&
                (pending.length > 0 ? (
                  pending.map((req) => (
                    <div key={req.id} className="swipe-request-item">
                      <img
                        src={req.fromUser?.image || `https://picsum.photos/seed/${req.fromUserId}/100/100`}
                        alt={req.fromUser?.name || 'User'}
                        className="swipe-request-image"
                      />
                      <div className="swipe-request-info">
                        <h3>{req.fromUser?.name || `User ${req.fromUserId}`}</h3>
                        <p>{req.fromUser?.role || ''}</p>
                      </div>
                      <div className="swipe-request-actions">
                        <button className="swipe-request-accept" onClick={() => acceptRequest(req.id)}>✓</button>
                        <button className="swipe-request-reject" onClick={() => rejectRequest(req.id)}>✕</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="swipe-requests-empty">No received requests</p>
                ))}

              {requestsTab === 'sent' &&
                (sent.length > 0 ? (
                  sent.map((req) => (
                    <div key={req.id} className="swipe-sent-request-item">
                      <div className="swipe-sent-request-info">
                        <h3>{req.toUser?.name || `User ${req.toUserId}`}</h3>
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
