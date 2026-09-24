import { movies } from "./data/movies";

const iconPath = "/icons/movie-icons";

function App() {
  return (
    <div className="app">
      <header className="header">
        <nav className="nav" aria-label="주요 메뉴">
          <a className="brand" href="/" aria-label="UMCine 홈">
            <span className="brand-icon">
              <img src={`${iconPath}/movie.svg`} alt="" />
            </span>
            <span>UMCine</span>
          </a>
          <a className="nav-link active" href="/">
            영화
          </a>
          <a className="nav-link" href="/">
            검색
          </a>
          <a className="nav-link" href="/">
            내 정보
          </a>
        </nav>

        <div className="actions">
          <button className="icon-button" type="button" aria-label="검색">
            <img src={`${iconPath}/search.svg`} alt="" />
          </button>
          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </header>

      <main className="main">
        <h1>영화 목록</h1>
        <section className="movie-grid" aria-label="영화 목록">
          {movies.map((movie) => (
            <article className="movie-card" key={movie.id}>
              <div className="poster-wrap">
                <img className="poster" src={movie.posterPath} alt={movie.title} />
                <button
                  className={`bookmark ${movie.isBookmarked ? "selected" : ""}`}
                  type="button"
                  aria-label={`${movie.title} 북마크`}
                />
              </div>
              <h2>{movie.title}</h2>
              <p>{movie.releaseDate}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
