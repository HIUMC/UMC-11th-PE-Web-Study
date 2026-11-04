SELECT b.title, t.name AS tag_name,
       CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
FROM `book` b
JOIN `book_tag` bt ON b.book_id = bt.book_id
JOIN `tag` t ON bt.tag_id = t.tag_id
LEFT JOIN `book_like` bl ON bl.book_id = b.book_id AND bl.user_id = 1
WHERE b.book_id = 1;
