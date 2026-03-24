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
      {notification && (
        <div className={`swipe-notification swipe-notification-${notification.type}`}>
          {notification.text}
        </div>
      )}

      {profile && (
        <div className="swipe-card-wrapper">
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
    </div>
  )
}

export default SwipePage
