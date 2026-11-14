import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '../pages/account/profile-page'

export const Route = createFileRoute('/profile')({ component: function ProfileRoute() {
  return <ProfilePage editing={false} />
} })
