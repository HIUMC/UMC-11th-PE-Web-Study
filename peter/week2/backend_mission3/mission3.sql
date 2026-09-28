USE book_rental_practice;

SELECT
  b.title,
  t.name AS tag_name,
  (bl.user_id IS NOT NULL) AS is_liked
FROM book AS b
JOIN book_tag AS bt
  ON b.book_id = bt.book_id
JOIN tag AS t
  ON bt.tag_id = t.tag_id
LEFT JOIN book_like AS bl
  ON b.book_id = bl.book_id
  AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id ASC;