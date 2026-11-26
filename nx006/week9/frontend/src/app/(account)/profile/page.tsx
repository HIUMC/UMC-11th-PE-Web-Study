import { ProfilePage } from '../../../screens/account/profile-page'

export const metadata = { title: '내 정보' }

export default function Page() {
  return <ProfilePage editing={false} />
}
