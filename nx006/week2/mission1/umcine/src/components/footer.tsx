import { Icon } from './icon'

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner">
    <Icon name="tmdb-logo" />
    <p>This product uses the TMDB API but is not endorsed or certified by <a href="https://www.themoviedb.org/?language=ko" target="_blank" rel="noreferrer">TMDB</a>.</p>
  </div></footer>
}
