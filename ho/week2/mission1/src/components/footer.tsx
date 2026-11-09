export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-end gap-2 px-8 text-xs text-slate-500 lg:px-12">
        <img
          src="/umcine-images/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-2.5 w-auto"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
