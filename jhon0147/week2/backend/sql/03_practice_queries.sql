USE umc_week2;

-- ==================================================
-- 본문 실습 1-1: 대여 가능한 책을 최신순으로 조회
-- ==================================================

SELECT
  book_id,
  title,
  description
FROM book
WHERE is_available = TRUE
ORDER BY book_id DESC;


-- ==================================================
-- 본문 실습 1-4: LIMIT/OFFSET으로 페이지 나누기
-- ==================================================

-- 첫 번째 페이지
SELECT
  book_id,
  title
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 0;

-- 두 번째 페이지
SELECT
  book_id,
  title
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 10;


-- 결과 확인용: 한 페이지에 2개씩 조회
SELECT
  book_id,
  title
FROM book
ORDER BY book_id DESC
LIMIT 2 OFFSET 0;

SELECT
  book_id,
  title
FROM book
ORDER BY book_id DESC
LIMIT 2 OFFSET 2;