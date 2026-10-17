export function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface px-4 py-4 md:px-10 xl:px-20">
      {/* 로고는 비율 유지를 위해 너비만 지정 (색·비율 변경 금지) */}
      <img className="h-auto w-6" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <p className="text-xs text-ink-secondary">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
