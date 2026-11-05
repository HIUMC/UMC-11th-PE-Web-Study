import { Outlet } from "@tanstack/react-router";
import Header from "./components/header";

export default function App() {
  return (
    <>
      <Header />

      <Outlet />

      <footer className="footer">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="TMDB 웹사이트"
        >
          <img
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
            width="80"
          />
        </a>

        <span>
          This product uses the TMDB API but is not endorsed or certified
          by TMDB.
        </span>
      </footer>
    </>
  );
}