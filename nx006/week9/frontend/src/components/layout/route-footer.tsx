'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '../footer'

export function RouteFooter() {
  const path = usePathname()
  if (path === '/login' || path === '/signup' || path === '/profile/edit') return null
  return <Footer />
}
