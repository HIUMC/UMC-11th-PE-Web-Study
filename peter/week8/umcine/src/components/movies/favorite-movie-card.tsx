import { useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "@/api/movies/movie-query-options";
import MovieCard from "./movie-card";

interface FavoriteMovieCardProps {
  movieId: number;
}

export function FavoriteMovieCard({ movieId }: FavoriteMovieCardProps) {
  const movieQuery = useQuery(movieDetailQueryOptions(movieId));

  if (movieQuery.isPending) {
    return <p role="status">영화 정보를 불러오는 중이에요.</p>;
  }

  if (movieQuery.isError) {
    return (
      <div role="alert">
        <p>영화 {movieId} 정보를 불러오지 못했어요.</p>
        <button type="button" onClick={() => void movieQuery.refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  return <MovieCard movie={movieQuery.data} />;
}