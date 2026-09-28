-- 미션 3: 특정 책(1번)의 태그 목록 + 특정 사용자(1번)의 좋아요 여부
-- 결과: 책 제목, 태그 이름, 좋아요 여부
USE book_rental;

SELECT
  b.title,
  t.name AS tag_name,
  CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked
FROM book b
JOIN book_tag bt ON b.book_id = bt.book_id
JOIN tag t       ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON bl.book_id = b.book_id AND bl.user_id = 1
WHERE b.book_id = 1;
