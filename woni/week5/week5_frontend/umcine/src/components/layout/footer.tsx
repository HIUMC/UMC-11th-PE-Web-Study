export function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-[#e3e6eb] bg-white px-20 py-4">
      <img src="/icons/tmdb-logo.svg" alt="" className="size-6" />
      <p className="text-xs text-[#606774]">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/?language=ko"
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
