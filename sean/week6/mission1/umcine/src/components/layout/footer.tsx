export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <img
          className="h-5 w-auto"
          src="/icons/tmdb-logo.svg"
          alt="TMDB"
        />
        <p className="text-xs text-neutral-500">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}