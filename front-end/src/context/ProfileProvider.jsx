import { useEffect, useState } from 'react'
import {
  ProfileContext,
  PROFILE_STORAGE_KEY,
  buildMappedProfile,
  loadInitialProfileData,
} from './ProfileContext'

export function ProfileProvider({ children }) {
  const [data, setData] = useState(loadInitialProfileData)

  useEffect(() => {
    const { password: _pw, ...accountSafe } = data.account
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ ...data, account: accountSafe })
    )
  }, [data])

  const updateAccount = (accountUpdates) => {
    setData((prev) => {
      const nextAccount = { ...prev.account, ...accountUpdates }
      return {
        ...prev,
        account: nextAccount,
        profile: buildMappedProfile(prev.profile, prev.onboarding, nextAccount),
      }
    })
  }

  const updateOnboarding = (onboardingUpdates) => {
    setData((prev) => {
      const nextOnboarding = { ...prev.onboarding, ...onboardingUpdates }
      return {
        ...prev,
        onboarding: nextOnboarding,
        profile: buildMappedProfile(prev.profile, nextOnboarding, prev.account),
      }
    })
  }

  const updateProfile = (profileUpdates) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates },
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
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
