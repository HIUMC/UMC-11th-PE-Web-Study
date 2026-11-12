export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex min-h-23 w-[min(1280px,calc(100%-48px))] flex-col items-center justify-center gap-2 py-5 text-center text-[11px] text-slate-400 sm:flex-row sm:gap-4">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="TMDB 홈페이지">
          <img className="w-19" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        </a>
        <div>
          <p>영화 데이터와 이미지는 TMDB API를 사용합니다.</p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
