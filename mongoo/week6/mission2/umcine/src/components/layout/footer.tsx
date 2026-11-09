export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="page-container flex min-h-[45px] items-center justify-end gap-2 py-3">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-auto w-5 shrink-0"
        />

        <p className="text-[9px] text-gray-500">
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
      </div>
    </footer>
  );
}
