SELECT book.title, book.description, category.name
FROM book
JOIN category
ON book.category_id = category.category_id
WHERE category.name = '문학'
  AND book.is_available = TRUE
ORDER BY book.book_id DESC
LIMIT 10;