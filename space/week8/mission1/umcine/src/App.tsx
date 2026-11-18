import Header from './components/layout/header.tsx'  
import './App.css'
import MovieGrid from './components/movies/movie-grid.tsx'
import { initialMovies } from './data/movies';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container">
        <span className = "container-title">영화 목록</span>
        <MovieGrid movies={initialMovies} />
      </main>
    </div>
  )
}

export default App