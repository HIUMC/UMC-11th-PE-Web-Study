import { Navigate, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthSession } from '../../hooks/use-auth-session'
import { meOptions } from '../../queries/account-queries'
import { ServiceFeedback } from '../service-feedback'

export function AuthenticatedLayout() {
  const session = useAuthSession()
  const me = useQuery(meOptions(session))
  if (!session.accessToken) return <Navigate to="/login" />
  // 토큰 존재 검사와 서버 확인을 구분하고 확인 전에는 개인정보를 렌더링하지 않는다.
  if (!me.data) return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 p-8"><ServiceFeedback {...me} /></main>
  return <div key={session.generation} className="contents"><Outlet /></div>
}
