import Header from './components/header.tsx'  
import './App.css'
import MovieGrid from './components/movie-grid.tsx'
import { initialMovies } from './data/movies';
import { useState } from 'react';

function App() {

  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId : number)
  {
      setMovies((currentMovies)=>
      currentMovies.map((movie) => movie.id === movieId ? {...movie, bookmarked: !movie.bookmarked} : movie));
  }

  return (
    <div className="App">
      <Header />
      <main className="container">
        <span className = "container-title">영화 목록</span>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
    </div>
  )
}

export default App