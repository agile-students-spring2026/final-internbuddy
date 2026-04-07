import { createContext, useContext, useEffect, useState } from 'react'

const PROFILE_STORAGE_KEY = 'internbuddy.profileData'

const defaultProfile = {
  name: 'My Name',
  major: 'cs @ NYU',
  internship: 'swe intern @ Amazon',
  location: 'NYC | May - Aug 2026',
  connections: 28,
  about:
    "I'm a CS student who loves hackathons, open-source, and building cool things. I'll be at Amazon this summer in NYC, and looking forward to meeting fellow interns!",
  interests: ['🎾 Tennis', '☕ Cafes', '🎵 Concerts', '🎮 Gaming', '📷 Photography', '✈ Travel'],
  personality: 'ESFJ',
  lookingFor: [
    { emoji: '🍣', label: 'Sushi chats' },
    { emoji: '🏀', label: 'Basketball games' },
    { emoji: '🎾', label: 'Tennis match' }
  ],
  hostingEvents: ['Sushi Night - June 12', 'Movie Night - June 19'],
  attendingEvents: ['Central Park Picnic - June 15']
}

const defaultData = {
  account: {
    email: '',
    countryCode: '+1',
    phoneNumber: ''
  },
  onboarding: {
    firstName: '',
    lastName: '',
    startMonth: '',
    endMonth: '',
    city: '',
    stateCode: '',
    headline: '',
    internshipLine: '',
    about: '',
    interests: []
  },
  profile: defaultProfile
}

function formatMonthLabel(value) {
  if (!value) return ''
  const [year, month] = value.split('-')
  const monthIndex = Number(month) - 1
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[monthIndex] || ''} ${year}`.trim()
}

function buildDateRange(startMonth, endMonth) {
  if (!startMonth && !endMonth) return ''

  if (startMonth && endMonth) {
    const [startYear, startMonthNum] = startMonth.split('-')
    const [endYear, endMonthNum] = endMonth.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const startName = monthNames[Number(startMonthNum) - 1] || ''
    const endName = monthNames[Number(endMonthNum) - 1] || ''

    if (startYear === endYear) {
      return `${startName} - ${endName} ${endYear}`
    }

    return `${formatMonthLabel(startMonth)} - ${formatMonthLabel(endMonth)}`
  }

  return formatMonthLabel(startMonth || endMonth)
}

function mapInterestsToDisplay(interests) {
  const emojiMap = {
    Tennis: '🎾',
    Cafes: '☕',
    Concerts: '🎵',
    Gaming: '🎮',
    Photography: '📷',
    Travel: '✈',
    Hackathons: '💻'
  }

  return interests.map((label) => `${emojiMap[label] || '✨'} ${label}`)
}

function buildMappedProfile(baseProfile, onboarding, account) {
  const fullName = `${onboarding.firstName} ${onboarding.lastName}`.trim()
  const locationValue = [
    onboarding.city || onboarding.stateCode,
    buildDateRange(onboarding.startMonth, onboarding.endMonth)
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    ...baseProfile,
    name: fullName || baseProfile.name,
    major: onboarding.headline || baseProfile.major,
    internship: onboarding.internshipLine || baseProfile.internship,
    location: locationValue || baseProfile.location,
    about: onboarding.about || baseProfile.about,
    interests:
      onboarding.interests.length > 0
        ? mapInterestsToDisplay(onboarding.interests)
        : baseProfile.interests,
    email: account.email,
    phone: `${account.countryCode} ${account.phoneNumber}`.trim()
  }
}

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [data, setData] = useState(defaultData)

  useEffect(() => {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      setData((prev) => ({
        ...prev,
        ...parsed,
        account: { ...prev.account, ...(parsed.account || {}) },
        onboarding: { ...prev.onboarding, ...(parsed.onboarding || {}) },
        profile: { ...prev.profile, ...(parsed.profile || {}) }
      }))
    } catch {
      localStorage.removeItem(PROFILE_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updateAccount = (accountUpdates) => {
    setData((prev) => {
      const nextAccount = { ...prev.account, ...accountUpdates }
      return {
        ...prev,
        account: nextAccount,
        profile: buildMappedProfile(prev.profile, prev.onboarding, nextAccount)
      }
    })
  }

  const updateOnboarding = (onboardingUpdates) => {
    setData((prev) => {
      const nextOnboarding = { ...prev.onboarding, ...onboardingUpdates }
      return {
        ...prev,
        onboarding: nextOnboarding,
        profile: buildMappedProfile(prev.profile, nextOnboarding, prev.account)
      }
    })
  }

  const updateProfile = (profileUpdates) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates }
    }))
  }

  return (
    <ProfileContext.Provider
      value={{
        account: data.account,
        onboarding: data.onboarding,
        profile: data.profile,
        updateAccount,
        updateOnboarding,
        updateProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
