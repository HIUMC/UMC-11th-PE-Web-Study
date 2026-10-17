import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  // URL의 search 값을 이 route가 쓸 모양으로 정리해요. query가 없어도 /search를 열 수 있어요.
  validateSearch: (search): { query?: string } => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});
