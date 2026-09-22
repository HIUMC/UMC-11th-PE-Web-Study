USE umc_books_week2;

-- 단일 테이블 조회: 사용 가능 책을 책 ID 역순으로.
SELECT book_id, title, description
FROM book
WHERE is_available = TRUE
ORDER BY book_id DESC;

-- 첫 페이지와 두 번째 페이지: 같은 정렬로 비교한다.
SELECT book_id, title FROM book ORDER BY book_id DESC LIMIT 10 OFFSET 0;
SELECT book_id, title FROM book ORDER BY book_id DESC LIMIT 10 OFFSET 10;
