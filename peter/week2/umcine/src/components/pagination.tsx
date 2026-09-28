import { useState } from "react";

const pages = [1, 2, 3, 4, 5];

export default function Pagination() {
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <nav className="pagination" aria-label="영화 목록 페이지">
        <button
            type="button"
            className="pagination__arrow"
            aria-label="이전 페이지"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page)=>page-1)}
        >
            <img
            src="/icons/movie-icons/chevron-left.svg"
            alt=""
            />
        </button>

        <div className="pagination__pages">
            {pages.map((page) => (
            <button
                key={page}
                type="button"
                className={
                page === currentPage
                    ? "pagination__button pagination__button--active"
                    : "pagination__button"
                }
                aria-current={page === currentPage ? "page" : undefined}
                onClick={()=>setCurrentPage(page)}
            >
                {page}
            </button>
            ))}
        </div>

        <button
            type="button"
            className="pagination__arrow"
            aria-label="다음 페이지"
            disabled={currentPage === 5}
            onClick={()=> setCurrentPage((page)=>page+1)}
        >
            <img
            src="/icons/movie-icons/chevron-right.svg"
            alt=""
            />
        </button>
        </nav>
    );
    }