import { MovieListPage } from "@/features/movies/movie-list-page";

export default function Page() {
  return (
    <>
      <MovieListPage />
      <footer className="mt-8 flex items-center justify-end gap-2 bg-white px-4 py-6 text-xs text-gray-500">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="w-12 shrink-0"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  );
}
