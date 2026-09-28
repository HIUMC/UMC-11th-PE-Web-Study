export default function Footer() {
  return (
    <footer className="footer">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt=""
        className="footer__logo"
      />
      <p className="footer__text">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/">TMDB</a>.
      </p>
    </footer>
  );
}

