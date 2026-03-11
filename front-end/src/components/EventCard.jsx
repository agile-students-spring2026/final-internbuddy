import './EventCard.css'

// COMPONENT FOR EVENT CARD - lets us reuse in other pages like saved events, my events, etc later on
function EventCard({ event }) {
  return (
    <div className="event-item">
      <div className="event-card">
        {/* random image from picsum - will be real image later */}
        <img className="event-image" src={`https://picsum.photos/seed/${event.id}/400/100`} alt="event" />
        <p className="event-name">{event.title}</p>
        <p className="event-desc">{event.description}</p>
        <p className="event-time">time {event.time}</p>
        <p className="event-date">date {event.date}</p>
      </div>
      {/* TODO: wire up to backend */}
      <button className="event-join-btn">join meetup</button>
    </div>
  )
}

export default EventCard
