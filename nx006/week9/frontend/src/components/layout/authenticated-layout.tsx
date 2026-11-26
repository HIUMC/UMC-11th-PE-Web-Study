'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuthReady } from '../../hooks/use-auth-ready'
import { useAuthSession } from '../../hooks/use-auth-session'
import { meOptions } from '../../queries/account-queries'
import { ServiceFeedback } from '../service-feedback'

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const ready = useAuthReady()
  const session = useAuthSession()
  const router = useRouter()
  const me = useQuery({ ...meOptions(session), enabled: ready && Boolean(session.accessToken) })

  useEffect(() => {
    if (ready && !session.accessToken) router.replace('/login')
  }, [ready, session.accessToken, router])

  if (!ready || !session.accessToken || !me.data) {
    return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 p-8">
      {ready && session.accessToken
        ? <ServiceFeedback {...me} />
        : <p role="status">로그인 상태를 확인하고 있어요…</p>}
    </main>
  }
  return <div key={session.generation} className="contents">{children}</div>
}
