function TmdbAttribution() {
  return (
    <footer className="flex min-h-12 w-full items-center justify-center gap-2 border-t border-border-default bg-bg-surface px-4 py-3 sm:justify-end sm:px-10">
      <a
        className="shrink-0"
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="The Movie Database (TMDB) 웹사이트 열기"
      >
        <img
          className="h-auto w-10"
          src="/images/logos/tmdb-logo.svg"
          alt="The Movie Database (TMDB)"
        />
      </a>
      <p className="text-[9px] leading-4 text-text-tertiary">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}

export default TmdbAttribution;
