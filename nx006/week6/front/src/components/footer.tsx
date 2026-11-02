export function Footer() {
  return <footer aria-label="데이터 출처 · Credits" className="mt-auto border-t border-[#e3e6eb] bg-white"><div className="mx-auto flex min-h-14 w-full max-w-[1440px] items-center justify-center gap-2 px-5 py-4 md:px-8 min-[701px]:justify-end xl:px-20">
    <img className="h-3 w-auto shrink-0" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
    <p className="text-[10px] leading-[15px] text-[#606774] min-[701px]:text-xs">This product uses the TMDB API but is not endorsed or certified by <a className="underline" href="https://www.themoviedb.org/?language=ko" target="_blank" rel="noreferrer">TMDB</a>.</p>
  </div></footer>
}
