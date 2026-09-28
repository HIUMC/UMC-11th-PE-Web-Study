USE umc_week2;
-- 미션 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10개
SELECT b.book_id, b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10 OFFSET 0;
