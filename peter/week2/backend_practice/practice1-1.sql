USE book_rental_practice;

SELECT book_id, title, description
FROM book
WHERE is_available = TRUE
ORDER BY book_id DESC;
