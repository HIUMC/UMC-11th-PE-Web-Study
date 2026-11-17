import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";
import { parsePageParam } from "../utils/page-param";

export const Route = createFileRoute("/")({
  validateSearch: (search): { page?: number } => ({
    page: parsePageParam(search.page),
  }),
  component: MovieListPage,
});
