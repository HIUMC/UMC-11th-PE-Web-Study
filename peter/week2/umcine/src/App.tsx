import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Footer from "./components/footer";
import "./App.css"
import Pagination from "./components/pagination";

export default function App() {
  return(
    <section>
      <Header />
      <main className="container">
        <h1>영화 목록</h1>
        <MovieGrid />
        <Pagination />
      </main>

      <Footer />
      
    </section>
  )
}
