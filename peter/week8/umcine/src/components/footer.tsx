export default function Footer() {
  return (
    <footer className="box-border flex h-[57px] w-full items-center justify-end gap-2 border-t border-[#e3e6eb] bg-white px-4 py-4 sm:px-10 xl:px-20">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt=""
        className="block h-6 w-6 shrink-0"
      />
      <p className="m-0 min-w-0 flex-1 truncate text-xs leading-[14px] font-normal text-[#606774] sm:h-3.5 sm:w-[398px] sm:flex-none sm:whitespace-nowrap">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/"
          className="text-inherit underline"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
