import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './YourEventsPage.css'

const hostingEvents = [
  { id: 1, title: 'Sushi Night', date: 'June 12' },
  { id: 2, title: 'Movie Night', date: 'June 19' },
]

const attendingEvents = [
  { id: 1, title: 'Central Park Picnic', date: 'June 15' },
  { id: 2, title: 'Rooftop Happy Hour', date: 'June 22' },
]

const privateEvents = [
  { id: 1, title: 'Alex & Friends Dinner', host: 'Alex Chen', date: 'June 14' },
  { id: 2, title: 'Priya Study Session', host: 'Priya S.', date: 'June 17' },
]

const suggestedEvents = [
  { id: 1, title: 'Intern Mixer NYC', date: 'June 20' },
  { id: 2, title: 'Tech Talk @ WeWork', date: 'June 25' },
  { id: 3, title: 'Brooklyn Foodie Tour', date: 'June 28' },
]

export default function YourEventsPage() {
  const navigate = useNavigate()
  const privateRef = useRef(null)

  return (
    <div className="your-events-page">
      <div className="ye-header">
        <button className="ye-back-btn" onClick={() => navigate('/events')}>← back</button>
        <h1 className="ye-title">Your Events</h1>
      </div>

      <section className="ye-section">
        <h2 className="ye-section-title">Hosting</h2>
        <div className="ye-bubbles">
          {hostingEvents.map(e => (
            <div key={e.id} className="ye-bubble">
              <span className="ye-bubble-title">{e.title}</span>
              <span className="ye-bubble-date">{e.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ye-section">
        <h2 className="ye-section-title">Attending</h2>
        <div className="ye-bubbles">
          {attendingEvents.map(e => (
            <div key={e.id} className="ye-bubble">
              <span className="ye-bubble-title">{e.title}</span>
              <span className="ye-bubble-date">{e.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ye-section" ref={privateRef}>
        <h2 className="ye-section-title">Private Events</h2>
        <div className="ye-bubbles">
          {privateEvents.map(e => (
            <div key={e.id} className="ye-bubble ye-bubble--private">
              <span className="ye-bubble-title">{e.title}</span>
              <span className="ye-bubble-host">from {e.host}</span>
              <span className="ye-bubble-date">{e.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ye-section">
        <h2 className="ye-section-title">Suggested For You</h2>
        <div className="ye-bubbles">
          {suggestedEvents.map(e => (
            <div key={e.id} className="ye-bubble ye-bubble--suggested">
              <span className="ye-bubble-title">{e.title}</span>
              <span className="ye-bubble-date">{e.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
