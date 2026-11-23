import { HTTPError } from "ky";
import { createTmdbClient } from "@/api/tmdb-client";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const searchParams = new URLSearchParams({ language: "ko-KR" });
  let path: string;

  if (type === "popular" || type === "search") {
    const page = Number(params.get("page") ?? "1");

    if (!Number.isSafeInteger(page) || page < 1 || page > 500) {
      return Response.json(
        { message: "잘못된 페이지 번호예요." },
        { status: 400 },
      );
    }

    searchParams.set("page", String(page));
    path = "movie/popular";

    if (type === "search") {
      const query = params.get("query")?.trim();
      if (!query) {
        return Response.json(
          { message: "검색어가 필요해요." },
          { status: 400 },
        );
      }

      path = "search/movie";
      searchParams.set("query", query);
      searchParams.set("include_adult", "false");
    }
  } else if (type === "detail") {
    const id = Number(params.get("movieId"));

    if (!Number.isSafeInteger(id) || id < 1) {
      return Response.json(
        { message: "잘못된 영화 번호예요." },
        { status: 400 },
      );
    }

    path = `movie/${id}`;
  } else {
    return Response.json({ message: "잘못된 요청이에요." }, { status: 400 });
  }

  try {
    const data = await createTmdbClient().get(path, { searchParams }).json();
    return Response.json(data);
  } catch (error) {
    const status =
      error instanceof HTTPError && error.response.status === 404 ? 404 : 502;

    return Response.json(
      { message: "영화 정보를 불러오지 못했어요." },
      { status },
    );
  }
}
