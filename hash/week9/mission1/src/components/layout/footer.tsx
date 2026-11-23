export default function Footer() {
  return (
    <footer className="border-t border-[#e9ecf2] bg-white">
      <div className="mx-auto flex min-h-14 max-w-[1328px] items-center justify-center gap-2 px-6 py-3 sm:justify-end">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="w-9 shrink-0"
        />

        <small className="text-[11px] leading-relaxed text-[#68717f]">
          This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </small>
      </div>
    </footer>
  );
}