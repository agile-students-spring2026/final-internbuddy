import { createContext, useContext } from 'react'

export const PROFILE_STORAGE_KEY = 'internbuddy.profileData'

export const defaultProfile = {
  name: '',
  major: '',
  internship: '',
  location: '',
  connections: 0,
  about: '',
  interests: [],
  personality: '',
  hostingEvents: [],
  attendingEvents: [],
}

export const defaultData = {
  account: {
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    password: '',
  },
  onboarding: {
    firstName: '',
    lastName: '',
    startMonth: '',
    endMonth: '',
    currentInternship: false,
    city: '',
    stateCode: '',
    headline: '',
    internshipLine: '',
    internshipHeadline: '',
    company: '',
    jobTitle: '',
    school: '',
    degree: '',
    lifestyle: '',
    about: '',
    interests: [],
    major: '',
    personality: '',
  },
  profile: defaultProfile,
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

function buildInternshipDateRange(startMonth, endMonth, currentInternship) {
  if (currentInternship && startMonth) {
    return `${formatMonthLabel(startMonth)} - Present`
  }

  return buildDateRange(startMonth, endMonth)
}

function mapInterestsToDisplay(interests) {
  const emojiMap = {
    Tennis: '🎾',
    Cafes: '☕',
    Concerts: '🎵',
    Gaming: '🎮',
    Photography: '📷',
    Travel: '✈',
    Hackathons: '💻',
  }

  return interests.map((label) => `${emojiMap[label] || '✨'} ${label}`)
}

export function buildMappedProfile(baseProfile, onboarding, account) {
  const fullName = `${onboarding.firstName} ${onboarding.lastName}`.trim()
  const locationValue = [
    onboarding.city || onboarding.stateCode,
    buildInternshipDateRange(
      onboarding.startMonth,
      onboarding.endMonth,
      onboarding.currentInternship
    ),
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    ...baseProfile,
    name: fullName || baseProfile.name,
    major: onboarding.major || onboarding.headline || baseProfile.major,
    internship: onboarding.internshipLine || baseProfile.internship,
    location: locationValue || baseProfile.location,
    about: onboarding.about || baseProfile.about,
    personality: onboarding.personality || baseProfile.personality,
    interests:
      onboarding.interests.length > 0
        ? mapInterestsToDisplay(onboarding.interests)
        : baseProfile.interests,
    email: account.email,
    phone: `${account.countryCode} ${account.phoneNumber}`.trim(),
  }
}

export function loadInitialProfileData() {
  if (typeof window === 'undefined') return defaultData

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!raw) return defaultData

  try {
    const parsed = JSON.parse(raw)
    return {
      ...defaultData,
      ...parsed,
      account: { ...defaultData.account, ...(parsed.account || {}) },
      onboarding: { ...defaultData.onboarding, ...(parsed.onboarding || {}) },
      profile: { ...defaultData.profile, ...(parsed.profile || {}) },
    }
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY)
    return defaultData
  }
}

export const ProfileContext = createContext(null)

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
