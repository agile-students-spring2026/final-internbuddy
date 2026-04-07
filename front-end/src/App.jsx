import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EventsProvider } from './context/EventsContext'
import { ProfileProvider } from './context/ProfileContext'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import CreateAccountEmailPage from './pages/CreateAccountEmailPage'
import CreateAccountPhonePage from './pages/CreateAccountPhonePage'
import CreateAccountVerifyPage from './pages/CreateAccountVerifyPage'
import CreateProfileResumePage from './pages/CreateProfileResumePage'
import CreateProfileNamePage from './pages/CreateProfileNamePage'
import CreateProfileDobPage from './pages/CreateProfileDobPage'
import CreateProfileLocationPage from './pages/CreateProfileLocationPage'
import CreateProfilePronounsPage from './pages/CreateProfilePronounsPage'
import CreateProfileGenderPage from './pages/CreateProfileGenderPage'
import CreateProfileFriendPrefPage from './pages/CreateProfileFriendPrefPage'
import CreateProfileInternshipPage from './pages/CreateProfileInternshipPage'
import CreateProfileJobTitlePage from './pages/CreateProfileJobTitlePage'
import CreateProfileSchoolPage from './pages/CreateProfileSchoolPage'
import CreateProfileDegreePage from './pages/CreateProfileDegreePage'
import CreateProfileLifestylePage from './pages/CreateProfileLifestylePage'
import CreateProfileMeetupPage from './pages/CreateProfileMeetupPage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SettingsDetailPage from './pages/SettingsDetailPage'
import AccountCenterPage from './pages/AccountCenterPage'
import AccountCenterDetailPage from './pages/AccountCenterDetailPage'
import YourEventsPage from './pages/YourEventsPage'
import CreateEventsPage from './pages/CreateEventsPage'
import BottomNav from './components/BottomNav'
import MessagesPage from './pages/MessagesPage'
import SwipePage from './pages/SwipePage'
import DirectMessagePage from './pages/DirectMessagePage'
import SearchPage from './pages/searchPage/searchPage'
import './App.css'

function App() {
  return (
    <EventsProvider>
      <ProfileProvider>
        <Router>
          <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/create-account/email" element={<CreateAccountEmailPage />} />
          <Route path="/create-account/phone" element={<CreateAccountPhonePage />} />
          <Route path="/create-account/verify" element={<CreateAccountVerifyPage />} />
          <Route path="/create-profile/resume" element={<CreateProfileResumePage />} />
          <Route path="/create-profile/name" element={<CreateProfileNamePage />} />
          <Route path="/create-profile/dob" element={<CreateProfileDobPage />} />
          <Route path="/create-profile/location" element={<CreateProfileLocationPage />} />
          <Route path="/create-profile/pronouns" element={<CreateProfilePronounsPage />} />
          <Route path="/create-profile/gender" element={<CreateProfileGenderPage />} />
          <Route path="/create-profile/friend-preference" element={<CreateProfileFriendPrefPage />} />
          <Route path="/create-profile/internship" element={<CreateProfileInternshipPage />} />
          <Route path="/create-profile/job-title" element={<CreateProfileJobTitlePage />} />
          <Route path="/create-profile/school" element={<CreateProfileSchoolPage />} />
          <Route path="/create-profile/degree" element={<CreateProfileDegreePage />} />
          <Route path="/create-profile/lifestyle" element={<CreateProfileLifestylePage />} />
          <Route path="/create-profile/meetup-types" element={<CreateProfileMeetupPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:settingKey" element={<SettingsDetailPage />} />
          <Route path="/account-center" element={<AccountCenterPage />} />
          <Route path="/account-center/:sectionKey" element={<AccountCenterDetailPage />} />
          <Route path="/your-events" element={<YourEventsPage />} />
          <Route path="/create-events" element={<CreateEventsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/swipe" element={<SwipePage />} />
          <Route path="/message/:id" element={<DirectMessagePage />} />
          <Route path="/search" element={<SearchPage />} />
          </Routes>
          <BottomNav />
        </Router>
      </ProfileProvider>
    </EventsProvider>
  )
}

export default App


