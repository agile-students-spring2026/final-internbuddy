import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './YourEventsPage.css'

export default function YourEventsPage() {
  const navigate = useNavigate()
  const privateRef = useRef(null)
  const [data, setData] = useState({ hosting: [], attending: [], private: [], suggested: [] })

  useEffect(() => {
    fetch('/api/events/me')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error('Failed to fetch your events:', err))
  }, [])

  return (
    <div className="your-events-page">
      <div className="ye-header">
        <button className="ye-back-btn" onClick={() => navigate('/events')}>← back</button>
        <h1 className="ye-title">Your Events</h1>
      </div>

      <section className="ye-section">
        <h2 className="ye-section-title">Hosting</h2>
        <div className="ye-bubbles">
          {data.hosting.map(e => (
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
          {data.attending.map(e => (
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
          {data.private.map(e => (
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
          {data.suggested.map(e => (
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
