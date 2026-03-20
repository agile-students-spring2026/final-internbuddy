import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import YourEventsPage from './pages/YourEventsPage'
import CreateEventsPage from './pages/CreateEventsPage'
import BottomNav from './components/BottomNav'
import MessagesPage from './pages/MessagesPage'
import DirectMessagePage from './pages/DirectMessagePage'
import './App.css'

// removed the default vite template stuff
// TODO: show login page if not logged in, events page if logged in. rn just shows login page.
const mockConversations = [
  {
    id: "c1",
    otherUser: {
      id: "u2",
      name: "John Green",
      username: "jgreen",
      avatar: "https://picsum.photos/seed/jgreen/100/100",
      subtitle: "SWE Intern @ Google",
    },
    lastMessage: "Sounds good, let’s figure something out this week.",
    timestamp: "2h",
    unreadCount: 1,
  },
];

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
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/message/:id" element={<DirectMessagePage />} />
      </Routes>
      <BottomNav />
    </Router>
  )
}

export default App
