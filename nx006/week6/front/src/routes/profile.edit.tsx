import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useUmcineContext } from '../hooks/umcine-store'
import { ProfilePage } from '../pages/profile-page'

export const Route = createFileRoute('/profile/edit')({ component: function ProfileEditRoute() {
  const { profile, available, saveProfile, logout, deleteAccount } = useUmcineContext()
  if (!profile) return <Navigate to="/login" />
  return <ProfilePage profile={profile} editing checkNickname={value => value === profile.nickname || available('nickname', value)} onSave={saveProfile} onLogout={logout} onDelete={deleteAccount} />
} })
