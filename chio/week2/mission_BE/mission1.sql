USE umc_week2;

SELECT
    b.title,
    b.description,
    c.name AS category_name
FROM book b
JOIN category c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

/*
기준 테이블은 book이며, 책의 카테고리 이름을 확인하기 위해 category 테이블을 category_id로 JOIN했습니다. 
WHERE에서는 카테고리가 문학이고 대여 가능한 책만 필터링하며, 
최신순으로 정렬한 뒤 LIMIT 10으로 최대 10권만 조회합니다.
*/