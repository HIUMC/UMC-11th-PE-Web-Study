-- 1. 카테고리별 대여 가능 도서 목록
SELECT 
    b.title, 
    b.description, 
    c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학' 
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

/*
기준 테이블은 도서 정보를 담고 있는 `book`이며, 화면에 표시할 카테고리 이름을 가져오고 필터링하기 위해 `category` 테이블과 JOIN했습니다. 
카테고리 이름이 '문학'이면서 현재 대여 가능한 상태(`is_available = TRUE`)인 데이터만 WHERE 조건으로 걸러냈습니다. 
최신 등록된 도서부터 나열하기 위해 `book_id` 기준 내림차순(DESC)으로 정렬하고, `LIMIT 10`을 통해 최대 10권만 반환하도록 제한했습니다.
*/