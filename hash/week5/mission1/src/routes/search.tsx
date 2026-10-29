import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";
import { readMoviePage } from "../utils/movies/page-search";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => ({
    query: typeof search.query === "string" ? search.query : undefined,
    page: readMoviePage(search.page),
  }),
  component: SearchPage,
});
