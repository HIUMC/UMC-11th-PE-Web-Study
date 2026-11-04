SELECT 
    b.book_id,
    b.title,
    GROUP_CONCAT(DISTINCT t.name ORDER BY t.tag_id SEPARATOR ', ') AS tag_list,
    CASE 
        WHEN bl.user_id IS NOT NULL THEN TRUE 
        ELSE FALSE 
    END AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id AND bl.user_id = 1
WHERE b.book_id = 1
GROUP BY b.book_id, b.title, bl.user_id;