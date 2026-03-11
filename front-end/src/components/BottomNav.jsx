import './BottomNav.css'

function BottomNav() {
  return (
    <div className="bottom-nav">
      {/* TODO: replace buttons with <Link> from react-router-dom once other pages exist */}
      <button className="nav-btn">Home</button>
      <button className="nav-btn">Search</button>
      <button className="nav-btn">Profile</button>
    </div>
  )
}

export default BottomNav
