function TmdbAttribution() {
  return (
    <footer className="flex w-full flex-col items-center gap-3 bg-[#0d253f] px-5 py-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:px-10">
      <a
        className="shrink-0"
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="The Movie Database (TMDB) 웹사이트 열기"
      >
        <img
          className="h-auto w-36"
          src="/images/logos/tmdb-logo.svg"
          alt="The Movie Database (TMDB)"
        />
      </a>
      <p className="max-w-xl text-xs leading-5 text-white/80">
        이 제품은 TMDB API를 사용하지만 TMDB의 보증이나 인증을 받지 않았습니다.
        <span className="mt-1 block text-white/60">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </p>
    </footer>
  );
}

export default TmdbAttribution;
