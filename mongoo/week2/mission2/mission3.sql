SELECT book.title, tag.name,
       CASE
           WHEN book_like.book_id IS NOT NULL THEN TRUE
           ELSE FALSE
       END AS is_liked
FROM book
JOIN book_tag
ON book.book_id = book_tag.book_id
JOIN tag
ON book_tag.tag_id = tag.tag_id
LEFT JOIN book_like
ON book.book_id = book_like.book_id
AND book_like.user_id = 1
WHERE book.book_id = 1;