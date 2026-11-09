export function Footer() {
  return (
    <footer className="mt-auto shrink-0 border-t border-gray-200 bg-white">
      <div className="mx-auto flex min-h-14 w-[calc(100%-32px)] max-w-7xl items-center justify-end gap-2 py-4 sm:w-[calc(100%-64px)]">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width={24} height={12} />
        <p className="text-[11px] text-gray-500">This product uses the TMDB API but is not endorsed or certified by <a className="underline" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.</p>
      </div>
    </footer>
  )
}
