import './App.css';
import Header from './components/header';
import MovieGrid from './components/movie-grid';
import Pagination from './components/pagination';

export default function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid />
        <Pagination />
      </main>

      <footer className="footer">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>
  );
}