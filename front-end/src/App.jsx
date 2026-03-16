import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import YourEventsPage from './pages/YourEventsPage'
import CreateEventsPage from './pages/CreateEventsPage'
import BottomNav from './components/BottomNav'
import './App.css'

// removed the default vite template stuff
// TODO: show login page if not logged in, events page if logged in. rn just shows login page.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/your-events" element={<YourEventsPage />} />
        <Route path="/create-events" element={<CreateEventsPage />} />
      </Routes>
      <BottomNav />
    </Router>
  )
}

export default App
