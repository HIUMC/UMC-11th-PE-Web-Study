import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '../pages/account/profile-page'

export const Route = createFileRoute('/profile_/edit')({ component: function ProfileRoute() {
  return <ProfilePage editing={true} />
} })
