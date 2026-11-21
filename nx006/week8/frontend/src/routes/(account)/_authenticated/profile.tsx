import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '../../../pages/account/profile-page'

export const Route = createFileRoute('/(account)/_authenticated/profile')({ component: function ProfileRoute() {
  return <ProfilePage editing={false} />
} })
