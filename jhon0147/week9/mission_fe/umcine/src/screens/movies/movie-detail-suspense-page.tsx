"use client";

import { Suspense } from "react";
import { useAuthStore } from "../../stores/auth-store";
import { useParams } from "next/navigation";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { getRequestErrorMessage } from "../../api/tmdb";
import { MovieDetailState } from "../../components/movies/movie-detail-state";
import { MovieDetailView } from "../../components/movies/movie-detail-view";
import { QueryFeedback } from "../../components/movies/query-feedback";
import { movieDetailOptions } from "../../queries/movie-queries";

export function MovieDetailSuspensePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const hydrated = useAuthStore(state => state.hasHydrated);
  const id = Number(movieId);
  const valid = /^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0;

  if (!valid) {
    return <MovieDetailState message="올바른 영화 번호를 입력해 주세요." />;
  }
  // useSuspenseQuery가 서버에서 브라우저 전용 상대 주소로 요청하지 않게 한다.
  if (!hydrated) return <MovieDetailState message="영화 상세 정보를 불러오는 중..." loading />;
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
