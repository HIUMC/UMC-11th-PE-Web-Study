import type { Movie } from '../type/movie_type';

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img className="poster-img" src={movie.posterPath} alt={movie.title} />
        {/* 클릭 시 부모로부터 받은 토글 함수 호출 */}
        <button className="bookmark-btn" onClick={() => onToggleBookmark(movie.id)}>
          <svg 
            width="24" height="24" viewBox="0 0 24 24" 
            fill={movie.isBookmarked ? "#3b82f6" : "rgba(0,0,0,0.5)"} 
            stroke={movie.isBookmarked ? "#3b82f6" : "white"} 
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </div>
  );
}