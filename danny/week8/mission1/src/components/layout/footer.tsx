export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1312px] items-center justify-end gap-2 px-4 py-5 text-xs text-ink-muted">
        <img src="/images/logos/tmdb-logo.svg" alt="" className="h-4" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
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
