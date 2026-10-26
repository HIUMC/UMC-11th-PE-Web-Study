import { createFileRoute } from "@tanstack/react-router";
import MovieDetailPage from "../pages/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});
