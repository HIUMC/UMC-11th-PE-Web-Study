import { Outlet, useLocation } from '@tanstack/react-router'
import { Header } from './header'
import { cn } from '../../utils/cn'

export function AppLayout() {
  const isSearchPage = useLocation({ select: (location) => location.pathname === '/search' })

  return (
    <div className={cn(
      'grid min-h-screen bg-[#f5f6f8] text-[#181a1f]',
      isSearchPage
        ? 'grid-rows-[90px_minmax(0,1fr)] max-[680px]:grid-rows-[72px_minmax(0,1fr)]'
        : 'grid-rows-[90px_minmax(0,1fr)_60px] max-[680px]:grid-rows-[72px_minmax(0,1fr)_auto]',
    )}>
      <Header />
      <Outlet />
      {!isSearchPage && (
        <footer className="flex items-center border-t border-[#e4e7eb] bg-white">
          <div className="mx-auto flex w-[calc(100%-48px)] max-w-[1296px] items-center justify-end gap-2 max-[680px]:w-[calc(100%-32px)] max-[680px]:justify-start max-[680px]:py-4">
            <img className="w-7" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
            <p className="m-0 text-xs leading-[1.4] text-[#727985]">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          </div>
        </footer>
      )}
    </div>
  )
}
