USE umc_week2;
-- 미션 3. 특정 책(book_id = 1)의 태그 목록 + 특정 사용자(user_id = 1)의 좋아요 여부
SELECT b.title,
       t.name AS tag_name,
       CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked
FROM book b
LEFT JOIN book_tag bt  ON b.book_id = bt.book_id
LEFT JOIN tag t        ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON bl.book_id = b.book_id
                      AND bl.user_id = 1
WHERE b.book_id = 1;
