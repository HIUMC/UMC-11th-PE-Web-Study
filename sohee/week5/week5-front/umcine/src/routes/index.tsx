import { createFileRoute } from "@tanstack/react-router";
import MovieListPage from "../components/movies/movie-list-page";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});
