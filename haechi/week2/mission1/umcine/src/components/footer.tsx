import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer__logo" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <p className="footer__text">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
