export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <img
          src="/umcine-images/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="footer-logo"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
