use umc_week2;

-- MISSION 1 : 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회하기
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
기준 테이블 : 도서목록을 조회하는 것이므로 book
JOIN 이유 : 카테고리 이름을 가져오기 위해 categoty 테이블을 join
WHERE 조건 : 카테고리가 '문학' 이면서 대여 가능한 도서만
정렬/목록 기준 : book_id를 내림차순으로 정렬하여 최신순 + LIMIT 10을 사용해 최대 10개만 조회
*/

-- MISSION 2 : 특정 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 조회하기
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

/*
기준 테이블 : 사용자의 대여 내역을 조회하는 것이므로 rental
JOIN 이유 : 대여한 책의 제목을 가져오기 위해 book 테이블 join
WHERE 조건 : 특정 사용자의 대여 내역 중 아직 반납하지 않은 책만 조회
정렬/목록 기준 : due_at을 오름차순으로 장렬하여 반납 예정일이 빠른 책부터 조회
*/

-- MISSION 3 : 특정 책의 태그 목록과 특정 사용자의 좋아요 여부 조회하기
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

/*
기준 테이블 : 특정 책의 상세 정보를 조회하는 것이므로 book
JOIN 이유 : 책의 태그를 가져오기 위해 book_tag와 tag를 join
           특정 사용자의 좋아요 여부를 확인하기 위해 book_like를 left join
WHERE 조건 : 특정 book_id를 지정
정렬/목록 기준 : x
*/



