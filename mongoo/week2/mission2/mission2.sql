SELECT book.title, rental.rented_at, rental.due_at
FROM rental
JOIN book
ON rental.book_id = book.book_id
WHERE rental.user_id = 1
  AND rental.returned_at IS NULL
ORDER BY rental.due_at ASC;