import { Link, useParams } from "@tanstack/react-router";
import BookmarkButton from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="main">
        <div className="page-content">
          <p>영화를 찾을 수 없어요.</p>
          <Link to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="page-content">
        <Link to="/">← 영화 목록</Link>

        <img
          className="detail-backdrop"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        <div className="detail-content">
          <img
            className="detail-poster"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div>
            <h1>{movie.title}</h1>
            <p>{movie.originalTitle}</p>
            <p>{movie.releaseDate}</p>
            <p>{movie.genres.join(" · ")}</p>
            <p>{movie.runtime}</p>
            <h2>{movie.tagline}</h2>
            <p>{movie.overview}</p>

            <BookmarkButton movieId={movie.id} />
          </div>
        </div>
      </div>
    </main>
  );
}