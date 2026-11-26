import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { Header } from '../components/layout/header'
import { RouteFooter } from '../components/layout/route-footer'
import { Providers } from './providers'
import '../index.css'

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-pretendard',
})

export const metadata: Metadata = {
  title: { default: 'UMCine', template: 'UMCine — %s' },
  description: '인기 영화 목록과 검색, 나의 즐겨찾기와 평점을 모아 보는 UMCine.',
  icons: { icon: 'data:,' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko">
    <body className={pretendard.variable}>
      <Providers>
        <a className="absolute -top-20 left-4 z-50 bg-white p-3 focus:top-2" href="#main-content">본문으로 이동</a>
        <Header />
        {children}
        <RouteFooter />
      </Providers>
    </body>
  </html>
}
