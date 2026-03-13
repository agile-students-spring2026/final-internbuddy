import { useMemo, useRef } from 'react'
import { faker } from '@faker-js/faker'
import { useNavigate } from 'react-router-dom'
import './YourEventsPage.css'

function buildEvent(idOffset) {
  return {
    id: idOffset,
    title: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    date: faker.date.soon().toLocaleDateString(),
    time: faker.date.soon().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

function EventBubble({ event, label }) {
  return (
    <div className="your-events-bubble">
      <div className="your-events-badge">{label}</div>
      <p className="your-events-bubble-title">{event.title}</p>
      <p className="your-events-bubble-desc">{event.description}</p>
      {event.connectionNote ? <p className="your-events-connection-note">{event.connectionNote}</p> : null}
      <p className="your-events-bubble-meta">{event.date} at {event.time}</p>
    </div>
  )
}

function YourEventsSection({ title, subtitle, events, label }) {
  return (
    <section className="your-events-section">
      <div className="your-events-section-header">
        <h3 className="your-events-section-title">{title}</h3>
        <p className="your-events-section-subtitle">{subtitle}</p>
      </div>
      <div className="your-events-bubbles">
        {events.map((event) => (
          <EventBubble key={event.id} event={event} label={label} />
        ))}
      </div>
    </section>
  )
}

function YourEventsPage() {
  const navigate = useNavigate()
  const privateEventsRef = useRef(null)

  const hostedEvents = useMemo(
    () => Array.from({ length: 3 }, (_, index) => buildEvent(index + 1)),
    [],
  )

  const attendingEvents = useMemo(
    () => Array.from({ length: 3 }, (_, index) => buildEvent(index + 11)),
    [],
  )

  const suggestedEvents = useMemo(
    () => Array.from({ length: 4 }, (_, index) => buildEvent(index + 21)),
    [],
  )

  const privateEvents = useMemo(
    () => [
      {
        id: 101,
        title: 'Connection Game Night',
        description: 'Small apartment game night with interns already connected through your network.',
        date: '6/18/2026',
        time: '07:00 PM',
        connectionNote: 'Created by Alex Chen and Priya S. for mutual connections only',
      },
      {
        id: 102,
        title: 'Friends-Only Rooftop Dinner',
        description: 'Private dinner meetup for friends of friends interning in the city this summer.',
        date: '6/24/2026',
        time: '06:30 PM',
        connectionNote: 'Hosted by Jordan Lee with invites shared through your connections',
      },
    ],
    [],
  )

  const scrollToPrivateEvents = () => {
    privateEventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="your-events-page">
      <div className="events-top-bar">
        <button className="events-top-btn your-events-top-btn-active">your events</button>
        <button className="events-top-btn" onClick={scrollToPrivateEvents}>private events</button>
      </div>

      <div className="events-header your-events-header">
        <h1 className="events-title">Your Events</h1>
        <h2 className="events-subtitle">hosting, attending, private, suggested</h2>
      </div>

      <div className="your-events-content">
        <YourEventsSection
          title="Hosting"
          subtitle="Events you are currently organizing"
          events={hostedEvents}
          label="Hosting"
        />
        <YourEventsSection
          title="Attending"
          subtitle="Plans you already joined"
          events={attendingEvents}
          label="Attending"
        />
        <section className="your-events-section" ref={privateEventsRef}>
          <div className="your-events-section-header">
            <h3 className="your-events-section-title">Private Events</h3>
            <p className="your-events-section-subtitle">Events created between your friend connections</p>
          </div>
          <div className="your-events-bubbles">
            {privateEvents.map((event) => (
              <EventBubble key={event.id} event={event} label="Private" />
            ))}
          </div>
        </section>
        <YourEventsSection
          title="Suggested"
          subtitle="Extra meetups you may want to join"
          events={suggestedEvents}
          label="Suggested"
        />
      </div>

      <div className="events-bottom-nav">
        <button className="nav-btn" onClick={() => navigate('/events')}>Home</button>
        <button className="nav-btn">Search</button>
        <button className="nav-btn" onClick={() => navigate('/profile')}>Profile</button>
      </div>
    </div>
  )
}

export default YourEventsPage