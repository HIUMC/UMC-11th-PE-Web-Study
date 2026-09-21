import "./footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <img src="/images/logos/tmdb-logo.svg" alt="" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
