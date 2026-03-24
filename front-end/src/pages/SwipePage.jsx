import { useState } from 'react'
import './SwipePage.css'

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Sarah',
    age: 21,
    location: 'San Francisco, CA',
    school: 'UC Berkeley',
    jobTitle: 'Data Science Intern',
    internship: 'Google',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile1/400/500',
    interests: ['Food', 'Music', 'Reading'],
    drinks: 'Socially',
  },
  {
    id: 2,
    name: 'Jessica',
    age: 22,
    location: 'San Francisco, CA',
    school: 'Stanford',
    jobTitle: 'Software Engineer Intern',
    internship: 'Meta',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile2/400/500',
    interests: ['Sports', 'Party', 'Creation'],
    drinks: 'Yes',
  },
  {
    id: 3,
    name: 'Alex',
    age: 23,
    location: 'San Francisco, CA',
    school: 'MIT',
    jobTitle: 'Product Manager Intern',
    internship: 'Apple',
    pronouns: 'they/them',
    image: 'https://picsum.photos/seed/profile3/400/500',
    interests: ['Music', 'Creation', 'Reading'],
    drinks: 'No',
  },
  {
    id: 4,
    name: 'Elena',
    age: 20,
    location: 'San Francisco, CA',
    school: 'Cal Poly',
    jobTitle: 'UX Designer Intern',
    internship: 'Adobe',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile4/400/500',
    interests: ['Food', 'Creation', 'Drinks'],
    drinks: 'Socially',
  },
  {
    id: 5,
    name: 'Morgan',
    age: 22,
    location: 'San Francisco, CA',
    school: 'UC Santa Cruz',
    jobTitle: 'Backend Engineer Intern',
    internship: 'Stripe',
    pronouns: 'he/him',
    image: 'https://picsum.photos/seed/profile5/400/500',
    interests: ['Sports', 'Reading', 'Music'],
    drinks: 'Socially',
  },
]

function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [notification, setNotification] = useState(null)

  const profile = MOCK_PROFILES[currentIndex]

  const handleReject = () => {
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setNotification(null)
    } else {
      setNotification({ type: 'info', text: "No more profiles — check back soon!" })
    }
  }

  const handleAccept = () => {
    setNotification({ type: 'success', text: `✓ Friend request sent to ${profile.name}!` })
    setTimeout(() => {
      if (currentIndex < MOCK_PROFILES.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setNotification(null)
      } else {
        setNotification({ type: 'info', text: "No more profiles — check back soon!" })
      }
    }, 1600)
  }

  return (
    <div className="swipe-page">
      <div className="swipe-container">
        {notification && (
          <div className={`swipe-notification swipe-notification-${notification.type}`}>
            {notification.text}
          </div>
        )}

        {profile && (
          <>
            <div className="swipe-card">
              <img className="swipe-image" src={profile.image} alt={profile.name} />
              <div className="swipe-overlay" />
              <div className="swipe-info">
                <div className="swipe-header">
                  <h1 className="swipe-name">{profile.name}</h1>
                  <p className="swipe-age">{profile.age}</p>
                </div>
                <p className="swipe-label">{profile.location}</p>

                <div className="swipe-details">
                  <div className="swipe-detail-row">
                    <span className="swipe-detail-label">School:</span>
                    <span className="swipe-detail-value">{profile.school}</span>
                  </div>
                  <div className="swipe-detail-row">
                    <span className="swipe-detail-label">Job Title:</span>
                    <span className="swipe-detail-value">{profile.jobTitle}</span>
                  </div>
                  <div className="swipe-detail-row">
                    <span className="swipe-detail-label">Internship:</span>
                    <span className="swipe-detail-value">{profile.internship}</span>
                  </div>
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
                  <p className="swipe-interests-label">Interests:</p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default SwipePage
