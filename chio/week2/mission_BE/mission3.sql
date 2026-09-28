USE umc_week2;

SELECT
    t.name AS tag_name,
    EXISTS (
        SELECT 1
        FROM book_like bl
        WHERE bl.book_id = b.book_id
          AND bl.user_id = 2
    ) AS is_liked
FROM book b
LEFT JOIN book_tag bt
    ON b.book_id = bt.book_id
LEFT JOIN tag t
    ON bt.tag_id = t.tag_id
WHERE b.book_id = 1
ORDER BY t.tag_id ASC;

/*

기준 테이블은 book이며, 책과 태그가 N:M 관계이므로 중간 테이블 book_tag를 거쳐 tag 테이블을 JOIN합니다.
WHERE에서는 특정 책만 선택하고, book_like를 이용해 특정 사용자의 좋아요 여부를 확인하며 태그 목록은 tag_id 기준으로 정렬합니다.
*/