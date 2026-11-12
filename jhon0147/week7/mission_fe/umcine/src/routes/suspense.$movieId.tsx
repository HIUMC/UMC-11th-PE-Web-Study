import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailSuspensePage } from "../pages/movies/movie-detail-suspense-page";

export const Route = createFileRoute("/suspense/$movieId")({
  component: MovieDetailSuspensePage,
});
