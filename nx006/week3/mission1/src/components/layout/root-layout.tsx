import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Footer } from '../footer'
import { Header } from './header'
import { useUmcineContext } from '../../hooks/umcine-store'

export function RootLayout() {
  const { profile } = useUmcineContext()
  const pathname = useRouterState({ select: state => state.location.pathname })
  const hideFooter = pathname === '/login' || pathname === '/signup' || pathname === '/search' || pathname === '/profile/edit'
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `UMCine — ${pathname === '/' ? '영화 목록' : pathname === '/search' ? '영화 검색' : pathname.startsWith('/movies/') ? '영화 상세' : pathname.startsWith('/profile') ? '내 정보' : pathname === '/signup' ? '회원가입' : pathname === '/login' ? '로그인' : '페이지를 찾을 수 없어요'}`
  }, [pathname])
  return <>
    <a className="absolute -top-20 left-4 z-50 bg-white p-3 focus:top-2" href="#main-content">본문으로 이동</a>
    <Header loggedIn={profile !== null} />
    <Outlet />
    {!hideFooter && <Footer />}
  </>
}

export function NotFound() {
  return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 md:px-8 xl:px-20"><h1 className="text-3xl font-bold">페이지를 찾을 수 없어요.</h1><Link className="mt-4 inline-block text-[#2563eb]" to="/">영화 목록으로 돌아가기</Link></main>
}
