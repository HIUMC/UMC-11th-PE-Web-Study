USE book_rental_practice;

SELECT
  b.title,
  r.rented_at,
  r.due_at
FROM rental AS r
JOIN book AS b
  ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;