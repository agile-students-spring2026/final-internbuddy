import { Link } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  return (
    <div className="bottom-nav">
      <Link className="nav-btn" to="/events">Home</Link>
      {/* TODO: wire up once search + profile pages exist */}
      <button className="nav-btn">Search</button>
      <button className="nav-btn">Profile</button>
    </div>
  )
}
export default BottomNav
