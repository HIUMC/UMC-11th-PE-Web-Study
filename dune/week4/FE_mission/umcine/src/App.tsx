import { Outlet } from "@tanstack/react-router";
import Header from "./components/header";

export default function App() {
  return (
    <>
      <Header />

      <Outlet />

      <footer className="footer">
        🎞 This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}