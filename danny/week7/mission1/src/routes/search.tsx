import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";
import { parsePageParam } from "../utils/page-param";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => ({
    query: typeof search.query === "string" ? search.query : undefined,
    page: parsePageParam(search.page),
  }),
  component: SearchPage,
});
