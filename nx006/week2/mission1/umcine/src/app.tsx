import { useEffect } from 'react'
import { useUmcine } from './hooks/use-umcine'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { movieDetails } from './data/movie-details'
import { useRoute, navigate } from './hooks/use-route'
import { MovieListPage } from './pages/movie-list-page'
import { SearchPage } from './pages/search-page'
import { MovieDetailPage } from './pages/movie-detail-page'
import { AuthPage } from './pages/auth-page'
import { ProfilePage } from './pages/profile-page'

export default function App() {
  const { movies, currentPage, setCurrentPage, profile, reviews, available, toggleBookmark, authenticate, saveProfile, logout, deleteAccount, saveReview } = useUmcine()
  const { path, query } = useRoute()
  const isAuth = path === '/login' || path === '/signup'
  const noFooter = isAuth || path === '/search' || path === '/profile/edit'

  useEffect(() => {
    window.scrollTo(0, 0)
    if (path.startsWith('/profile') && !profile) navigate('/login')
    document.title = 'UMCine — ' + (path.startsWith('/search') ? '영화 검색' : path.startsWith('/profile') ? '내 정보' : path === '/login' ? '로그인' : path === '/signup' ? '회원가입' : path.startsWith('/movies/') ? '영화 상세' : '영화 목록')
  }, [path, query, profile])

  const selectedMovie = movies.find(movie => path === '/movies/' + movie.id)
  let page
  if (path === '/') page = <MovieListPage movies={movies.filter(movie => movie.id <= 10)} onToggleBookmark={toggleBookmark} currentPage={currentPage} onPageChange={setCurrentPage} />
  else if (path === '/search' || path === '/search/results') page = <SearchPage key={path + query} query={query} movies={movies} results={path.endsWith('/results')} />
  else if (selectedMovie) page = <MovieDetailPage key={selectedMovie.id} movie={{ ...selectedMovie, ...movieDetails[selectedMovie.id] }} onToggleBookmark={toggleBookmark} review={reviews[selectedMovie.id]} onSaveReview={review => saveReview(selectedMovie.id, review)} />
  else if (isAuth) page = <AuthPage key={path} signup={path === '/signup'} checkAvailable={available} onSubmit={(user, password) => authenticate(user, password, path === '/signup')} />
  else if ((path === '/profile' || path === '/profile/edit') && profile) page = <ProfilePage key={path} editing={path.endsWith('/edit')} profile={profile} movies={movies} onToggleBookmark={toggleBookmark}
    checkNickname={value => value === profile.nickname || available('nickname', value)}
    onSave={saveProfile} onLogout={logout} onDelete={deleteAccount} />
  else if (path.startsWith('/profile') && !profile) page = <main className="container" id="main-content" tabIndex={-1}><p>로그인 화면으로 이동합니다.</p></main>
  else page = <main className="container" id="main-content" tabIndex={-1}><h1>페이지를 찾을 수 없어요.</h1><a className="text-link" href="#/">영화 목록으로 돌아가기</a></main>

  return <><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); const main = document.getElementById('main-content'); main?.setAttribute('tabindex', '-1'); main?.focus() }}>본문으로 이동</a><Header path={path} loggedIn={profile !== null} />{page}{!noFooter && <Footer />}</>
}
