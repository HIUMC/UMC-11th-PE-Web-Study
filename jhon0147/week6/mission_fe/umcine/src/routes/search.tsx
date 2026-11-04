import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => {
    const query = typeof search.query === "string" ? search.query.trim() : "";
    const page = Number(search.page);
    return {
      ...(query ? { query } : {}),
      ...(Number.isInteger(page) && page >= 1 && page <= 500 ? { page } : {}),
    };
  },
  component: SearchPage,
});
