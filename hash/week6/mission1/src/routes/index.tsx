import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";
import { readMoviePage } from "../utils/movies/page-search";

export const Route = createFileRoute("/")({
  validateSearch: (search): { page?: number } => ({
    page: readMoviePage(search.page),
  }),
  component: MovieListPage,
});
