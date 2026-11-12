import { Suspense } from "react";
import { useParams } from "@tanstack/react-router";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { getRequestErrorMessage } from "../../api/tmdb";
import { MovieDetailState } from "../../components/movies/movie-detail-state";
import { MovieDetailView } from "../../components/movies/movie-detail-view";
import { QueryFeedback } from "../../components/movies/query-feedback";
import { movieDetailOptions } from "../../queries/movie-queries";

export function MovieDetailSuspensePage() {
  const { movieId } = useParams({ from: "/suspense/$movieId" });
  const id = Number(movieId);
  const valid = /^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0;

  if (!valid) {
    return <MovieDetailState message="올바른 영화 번호를 입력해 주세요." />;
  }
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          resetKeys={[id]}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <MovieDetailState message={getRequestErrorMessage(error)} onRetry={() => resetErrorBoundary()} />
          )}
        >
          <Suspense fallback={<MovieDetailState message="영화 상세 정보를 불러오는 중..." loading />}>
            <MovieDetailContent movieId={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const detailQuery = useSuspenseQuery(movieDetailOptions(movieId));
  return (
    <MovieDetailView movie={detailQuery.data} feedback={
      <QueryFeedback
        isFetching={detailQuery.isFetching}
        error={detailQuery.error}
        onRetry={() => { void detailQuery.refetch(); }}
      />
    } />
  );
}
