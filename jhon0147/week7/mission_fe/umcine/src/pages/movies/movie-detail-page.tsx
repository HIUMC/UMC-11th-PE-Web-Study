import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRequestErrorMessage } from "../../api/tmdb";
import { MovieDetailView } from "../../components/movies/movie-detail-view";
import { MovieDetailState } from "../../components/movies/movie-detail-state";
import { QueryFeedback } from "../../components/movies/query-feedback";
import { movieDetailOptions } from "../../queries/movie-queries";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);
  const valid = /^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0;
  const detailQuery = useQuery({
    ...movieDetailOptions(id),
    enabled: valid,
  });
  const movie = detailQuery.data;
  const retry = () => { void detailQuery.refetch(); };

  if (!valid) {
    return <MovieDetailState message="올바른 영화 번호를 입력해 주세요." />;
  }
  if (detailQuery.isPending) {
    return <MovieDetailState message={detailQuery.fetchStatus === "paused" ? "인터넷 연결을 기다리고 있어요." : "영화 상세 정보를 불러오는 중..."} loading={detailQuery.isFetching} />;
  }
  if (!movie) {
    return <MovieDetailState message={getRequestErrorMessage(detailQuery.error)} onRetry={retry} />;
  }
  return (
    <MovieDetailView movie={movie} feedback={
      <QueryFeedback isFetching={detailQuery.isFetching} error={detailQuery.error} onRetry={retry} />
    } />
  );
}
