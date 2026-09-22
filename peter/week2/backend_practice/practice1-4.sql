USE book_rental_practice;

SELECT book_id, title, description
FROM book
ORDER by book_id DESC
LIMIT 10 OFFSET 0;