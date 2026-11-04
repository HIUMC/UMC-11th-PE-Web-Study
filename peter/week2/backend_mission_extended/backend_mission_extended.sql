USE book_rental_practice;

SELECT
  u.nickname,
  b.title AS book_title,
  t.name AS tag_name
FROM users AS u
JOIN book_like AS bl
  ON u.user_id = bl.user_id
JOIN book AS b
  ON bl.book_id = b.book_id
LEFT JOIN book_tag AS bt
  ON b.book_id = bt.book_id
LEFT JOIN tag AS t
  ON bt.tag_id = t.tag_id
WHERE u.user_id = 1
ORDER BY b.book_id DESC, t.tag_id ASC
LIMIT 10;