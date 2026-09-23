-- Mission 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회
-- 결과: 책 제목, 설명, 카테고리 이름

USE umc_week2;

SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- [설명]
-- 도서 목록을 조회하므로 book을 기준 테이블로 두고, 카테고리 이름은 category 테이블에만 있어
-- book의 FK(category_id)와 category의 PK를 ON으로 연결해 JOIN했다.
-- WHERE에서 카테고리 이름이 '문학'이고 대여 가능(is_available = TRUE)한 책만 남겼다.
-- book에 등록일 컬럼이 없어 AUTO_INCREMENT로 증가하는 book_id 내림차순을 최신순으로 보고,
-- LIMIT 10으로 최대 10개만 조회했다.
--
-- [실행 결과] 1행
-- title       | description | category_name
-- 달빛 도서관 | 소설        | 문학
--
-- [검증]
-- 문학 도서 2권 중 '겨울의 편지'는 대여 중(is_available = FALSE)이라 제외되어
-- 1건만 조회되므로 요구사항과 일치한다.
