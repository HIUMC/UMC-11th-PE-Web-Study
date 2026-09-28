interface MovieCardProps {
  title: string;
  releaseDate: string;
  posterPath: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export default function MovieCard({
  title,
  releaseDate,
  posterPath,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={posterPath}
          alt={`${title} 포스터`}
        />

<button
  type="button"
  className={`bookmark-button ${
    isBookmarked ? "bookmarked" : ""
  }`}
  onClick={onToggleBookmark}
  aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
>
  <img
    src={
      isBookmarked
        ? "/icons/movie-icons/bookmark.svg"
        : "/icons/movie-icons/bookmark-outline.svg"
    }
    alt=""
  />
</button>
      </div>

      <h2 className="movie-title">{title}</h2>
      <p className="movie-date">{releaseDate}</p>
    </article>
  );
}