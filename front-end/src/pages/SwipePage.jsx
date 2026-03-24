import { useState } from 'react'
import './SwipePage.css'

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Sarah',
    age: 21,
    major: 'Data Science @ UC Berkeley',
    internshipFull: 'Data Science Intern @ Google',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about:
      'I love data, coffee, and exploring new neighborhoods. Excited to meet other interns this summer!',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile1/400/500',
    interests: ['🎵 Music', '🍜 Food', '📚 Reading', '🎨 Art'],
    drinks: 'Socially',
  },
  {
    id: 2,
    name: 'Jessica',
    age: 22,
    major: 'Computer Science @ Stanford',
    internshipFull: 'Software Engineer Intern @ Meta',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about:
      "Full-stack developer, startup enthusiast, love hiking and trying new restaurants around the Bay.",
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile2/400/500',
    interests: ['🏀 Sports', '🎉 Party', '🎨 Creation', '☕ Cafes'],
    drinks: 'Yes',
  },
  {
    id: 3,
    name: 'Alex',
    age: 23,
    major: 'Electrical Engineering @ MIT',
    internshipFull: 'Product Manager Intern @ Apple',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about:
      "I love building products that matter. When I'm not working, you can find me at concerts or reading sci-fi.",
    pronouns: 'they/them',
    image: 'https://picsum.photos/seed/profile3/400/500',
    interests: ['🎵 Music', '🎨 Creation', '📚 Reading', '🏊 Swimming'],
    drinks: 'No',
  },
  {
    id: 4,
    name: 'Elena',
    age: 20,
    major: 'UX/UI Design @ Cal Poly',
    internshipFull: 'UX Designer Intern @ Adobe',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about:
      "Design lover and coffee enthusiast. I enjoy sketching, photography, and meeting creative people!",
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile4/400/500',
    interests: ['🍜 Food', '🎨 Creation', '🍹 Drinks', '📷 Photography'],
    drinks: 'Socially',
  },
  {
    id: 5,
    name: 'Morgan',
    age: 22,
    major: 'Computer Science @ UCSC',
    internshipFull: 'Backend Engineer Intern @ Stripe',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about:
      "Backend optimization nerd, weekend athlete, and always down for a good game night.",
    pronouns: 'he/him',
    image: 'https://picsum.photos/seed/profile5/400/500',
    interests: ['🏀 Sports', '📚 Reading', '🎵 Music', '🎮 Gaming'],
    drinks: 'Socially',
  },
]

function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [notification, setNotification] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [sentRequests, setSentRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [requestsTab, setRequestsTab] = useState('received')

  const mockReceivedRequests = [
    { id: 1, name: 'Priya S.', role: 'Design Intern @ Figma', image: 'https://picsum.photos/seed/priya/100/100' },
    { id: 2, name: 'Jordan K.', role: 'PM Intern @ Stripe', image: 'https://picsum.photos/seed/jordan/100/100' },
  ]

  const profile = MOCK_PROFILES[currentIndex]

  const handleReject = () => {
    setSwipeDirection('left')
    setTimeout(() => {
      if (currentIndex < MOCK_PROFILES.length - 1) {
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
    setTimeout(() => {
      if (currentIndex < MOCK_PROFILES.length - 1) {
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
          {(sentRequests.length + mockReceivedRequests.length) > 0 && (
            <span className="swipe-heart-badge">
              {sentRequests.length + mockReceivedRequests.length}
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
                Received ({mockReceivedRequests.length})
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
                (mockReceivedRequests.length > 0 ? (
                  mockReceivedRequests.map((req) => (
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
