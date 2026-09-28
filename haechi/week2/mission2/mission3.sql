-- 미션 3: 책(1번)의 태그 목록과 사용자(1번)의 좋아요 여부 조회
-- 결과: 책 제목, 태그 이름, 좋아요 여부
USE umc_book;

SELECT b.title,
       t.name AS tag_name,
       (bl.user_id IS NOT NULL) AS is_liked
FROM book b
LEFT JOIN book_tag bt  ON b.book_id = bt.book_id
LEFT JOIN tag t        ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON bl.book_id = b.book_id
                      AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id;
