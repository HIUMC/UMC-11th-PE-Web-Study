USE umc_books_week2;

-- 실행 화면 캡처용. 새 DB에서 데이터가 예상 수량인지 확인한다.
SELECT VERSION() AS mysql_version;
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'category', COUNT(*) FROM category
UNION ALL SELECT 'book', COUNT(*) FROM book
UNION ALL SELECT 'rental', COUNT(*) FROM rental
UNION ALL SELECT 'tag', COUNT(*) FROM tag
UNION ALL SELECT 'book_tag', COUNT(*) FROM book_tag
UNION ALL SELECT 'book_like', COUNT(*) FROM book_like
UNION ALL SELECT 'notification', COUNT(*) FROM notification;
