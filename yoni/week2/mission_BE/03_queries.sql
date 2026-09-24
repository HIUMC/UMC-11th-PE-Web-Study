-- =====================================================
-- 미션 1: 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회
-- =====================================================

-- 기준 테이블: 화면의 주 데이터가 도서 목록이므로 book을 기준으로 조회한다.
-- JOIN: 카테고리 이름은 category 테이블에 있으므로 category_id를 기준으로 JOIN한다.
-- WHERE: 카테고리가 '문학'이고 현재 대여 가능한 도서만 조회한다.
-- 정렬·목록 기준: book_id를 내림차순으로 정렬하고 최대 10개만 조회한다.
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


-- =====================================================
-- 미션 2: 특정 사용자가 아직 반납하지 않은 책 조회
-- =====================================================

-- 기준 테이블: 사용자의 대여 내역을 조회하므로 rental을 기준으로 조회한다.
-- JOIN: 대여한 책의 제목을 가져오기 위해 rental의 book_id와 book의 book_id를 연결한다.
-- WHERE: user_id가 1인 사용자의 대여 내역 중 아직 반납하지 않은 데이터만 조회한다.
-- 정렬 기준: 반납 예정일(due_at)이 빠른 순서대로 조회한다.

SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rental r
JOIN book b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;


-- =====================================================
-- 미션 3: 특정 책의 태그 목록과 특정 사용자의 좋아요 여부 조회
-- =====================================================

-- 기준 테이블: 특정 책의 상세 정보를 조회하므로 book을 기준으로 조회한다.
-- JOIN: 태그는 book → book_tag → tag 관계를 따라 조회한다.
-- 좋아요하지 않은 경우에도 책과 태그가 조회되어야 하므로 book_like는 LEFT JOIN한다.
-- WHERE: book_id가 1인 책을 조회하고, 좋아요 여부는 user_id가 1인 사용자를 기준으로 확인한다.
-- 정렬·목록 기준: 특정 책의 상세 정보 조회이므로 별도의 ORDER BY와 LIMIT은 사용하지 않는다.

SELECT
    b.title,
    t.name AS tag_name,
    CASE
        WHEN bl.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_liked
FROM book b
JOIN book_tag bt
    ON b.book_id = bt.book_id
JOIN tag t
    ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl
    ON b.book_id = bl.book_id
    AND bl.user_id = 1
WHERE b.book_id = 1;