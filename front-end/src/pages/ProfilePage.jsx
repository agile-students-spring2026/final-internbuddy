import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

const defaultProfile = {
  name: 'My Name',
  major: 'cs @ NYU',
  internship: 'swe intern @ Amazon',
  location: 'NYC | May - Aug 2026',
  connections: 28,
  about:
    "I'm a CS student who loves hackathons, open-source, and building cool things. I'll be at Amazon this summer in NYC, and looking forward to meeting fellow interns!",
  interests: ['Tennis', 'Cafes', 'Concerts', 'Gaming', 'Photography', 'Travel'],
  personality: 'ESFJ',
  lookingFor: [
    { label: 'Sushi chats' },
    { label: 'Basketball games' },
    { label: 'Tennis match' },
  ],
}

const allInterests = [
  'Tennis', 'Cafes', 'Concerts', 'Gaming', 'Photography', 'Travel',
  'Foodie', 'Reading', 'Climbing', 'Art', 'Karaoke', 'Swimming',
]

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(defaultProfile)
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState(defaultProfile)
  const [showInterestPicker, setShowInterestPicker] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [friendRequests] = useState([
    { id: 1, name: 'Alex Chen', role: 'pm intern @ Meta', mutual: 4 },
    { id: 2, name: 'Priya S.', role: 'design intern @ Figma', mutual: 2 },
  ])

  const openEdit = () => {
    setDraft({ ...profile })
    setEditMode(true)
  }

  const saveEdit = () => {
    setProfile({ ...draft })
    setEditMode(false)
    setShowInterestPicker(false)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setShowInterestPicker(false)
  }

  const toggleInterest = (interest) => {
    const current = draft.interests
    if (current.includes(interest)) {
      setDraft({ ...draft, interests: current.filter((item) => item !== interest) })
      return
    }

    if (current.length < 8) {
      setDraft({ ...draft, interests: [...current, interest] })
    }
  }

  return (
    <div className="app-shell">
      {editMode && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Edit Profile</h2>

            <label className="field-label">Name</label>
            <input className="field-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />

            <label className="field-label">Major / School</label>
            <input className="field-input" value={draft.major} onChange={(event) => setDraft({ ...draft, major: event.target.value })} />

            <label className="field-label">Internship</label>
            <input className="field-input" value={draft.internship} onChange={(event) => setDraft({ ...draft, internship: event.target.value })} />

            <label className="field-label">Location & Dates</label>
            <input className="field-input" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />

            <label className="field-label">About</label>
            <textarea className="field-input field-textarea" value={draft.about} onChange={(event) => setDraft({ ...draft, about: event.target.value })} />

            <label className="field-label">Personality Type</label>
            <input className="field-input" value={draft.personality} onChange={(event) => setDraft({ ...draft, personality: event.target.value })} />

            <label className="field-label">Interests ({draft.interests.length}/8)</label>
            <button className="chip-btn" onClick={() => setShowInterestPicker(!showInterestPicker)}>
              {showInterestPicker ? 'Done picking' : 'Edit Interests'}
            </button>

            {showInterestPicker && (
              <div className="interest-grid">
                {allInterests.map((interest) => (
                  <button
                    key={interest}
                    className={`interest-chip ${draft.interests.includes(interest) ? 'selected' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="events-top-bar">
        <button className="events-top-btn" onClick={() => navigate('/your-events')}>your events</button>
        <button className="events-top-btn" onClick={() => navigate('/create-events')}>create events</button>
      </div>

      <div className="scroll-area">
        {activeTab === 'profile' && (
          <>
            <div className="hero-card">
              <div className="avatar-ring">
                <div className="avatar">
                  <span>ME</span>
                </div>
              </div>
              <div className="hero-info">
                <h1 className="hero-name">{profile.name}</h1>
                <p className="hero-detail">{profile.major}</p>
                <p className="hero-detail accent">{profile.internship}</p>
                <p className="hero-detail muted">{profile.location}</p>
              </div>
            </div>

            <div className="connections-row">
              <div className="conn-badge">
                <span className="conn-num">{profile.connections}</span>
                <span className="conn-label">Connections</span>
              </div>
            </div>

            <div className="action-row">
              <button className="action-btn outline" onClick={() => setActiveTab('requests')}>
                Friend Requests
              </button>
              <button className="action-btn filled" onClick={openEdit}>
                Edit Profile
              </button>
            </div>

            <section className="card">
              <h3 className="section-heading">About me</h3>
              <p className="about-text">{profile.about}</p>
            </section>

            <section className="card">
              <h3 className="section-heading">Interests</h3>
              <div className="tags-wrap">
                {profile.interests.map((interest) => (
                  <span key={interest} className="tag">{interest}</span>
                ))}
                <button className="tag tag-add" onClick={openEdit}>+ Add</button>
              </div>
            </section>

            <section className="card personality-card">
              <span className="personality-label">Personality Type</span>
              <span className="personality-badge">{profile.personality}</span>
            </section>

            <section className="card">
              <h3 className="section-heading">Looking For</h3>
              <ul className="looking-list">
                {profile.lookingFor.map((item, index) => (
                  <li key={index} className="looking-item">{item.label}</li>
                ))}
              </ul>
            </section>

          </>
        )}

        {activeTab === 'requests' && (
          <div className="requests-page">
            <h2 className="page-title">Friend Requests</h2>
            {friendRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="req-avatar">{request.name[0]}</div>
                <div className="req-info">
                  <p className="req-name">{request.name}</p>
                  <p className="req-role">{request.role}</p>
                  <p className="req-mutual">{request.mutual} mutual connections</p>
                </div>
                <div className="req-actions">
                  <button className="btn-primary small">Accept</button>
                  <button className="btn-ghost small">Ignore</button>
                </div>
              </div>
            ))}
            <button className="action-btn outline" onClick={() => setActiveTab('profile')}>
              Back to profile
            </button>
          </div>
        )}
      </div>

      <div className="events-bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/events')}>Home</button>
        <button className="nav-btn">Search</button>
        <button className="nav-btn nav-btn-active">Profile</button>
      </div>
    </div>
  )
}

export default ProfilePage
