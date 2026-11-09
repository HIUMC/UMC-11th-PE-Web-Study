-- 3. 도서 상세의 태그와 좋아요 여부
SELECT 
    b.title, 
    t.name AS tag_name, 
    CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id AND bl.user_id = 1 /* 로그인한 사용자 ID */
WHERE b.book_id = 1; /* 조회하려는 책 ID */

/*
기준 테이블은 상세 페이지의 주체인 `book`이며, 태그 이름을 나열하기 위해 `book_tag`와 `tag` 테이블을 연결했습니다.
로그인한 사용자가 이 책에 좋아요를 눌렀는지 확인하기 위해 `book_like` 테이블을 사용자 ID 조건과 함께 LEFT JOIN하여, 기록 존재 여부(NOT NULL)로 `is_liked` 상태를 판별했습니다.
선택한 특정 도서(`book_id = 1`)만 WHERE 조건으로 조회하되, 도서에 등록된 태그가 없거나 좋아요를 누르지 않았을 때도 도서 정보가 정상 출력되도록 모두 LEFT JOIN을 사용했습니다.
*/