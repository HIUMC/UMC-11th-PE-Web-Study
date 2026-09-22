import { useState } from 'react';
import { movies as initialMovies } from '../data/movie_data';
import MovieCard from './movie-card';

export default function MovieGrid() {
  // 10편의 영화 데이터를 상태로 관리
  const [movieList, setMovieList] = useState(initialMovies);

  // 특정 ID를 가진 영화의 북마크 상태만 반전시키는 함수
  const handleToggleBookmark = (id: number) => {
    setMovieList((prevList) =>
      prevList.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  return (
    <div className="movie-grid">
      {movieList.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onToggleBookmark={handleToggleBookmark} 
        />
      ))}
    </div>
  );
}