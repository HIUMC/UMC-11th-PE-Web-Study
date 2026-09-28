SELECT
    b.title,
    t.name AS tag_name,
    bl.book_id IS NOT NULL AS is_liked
FROM book b
JOIN book_tag bt
    ON b.book_id = bt.book_id
JOIN tag t
    ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl
    ON b.book_id = bl.book_id
    AND bl.user_id = 1
WHERE b.book_id = 1;

/* 책 상세 화면을 조회하므로 book을 기준 테이블로 삼았습니다. book과 tag는 직접 연결할 공통 컬럼이 없어서 book_tag를 거쳐 book -> book_tag -> tag로 JOIN했습니다.
    book_like는 book_id를 가지고 있어 book에 바로 연결했습니다. book.book_id는 조회 대상 책을 지정하는 조건이므로 WHERE에 두었습니다.
    book_like.user_id는 WHERE에 넣으면 LEFT JOIN으로 살려둔 NULL 행을 다시 걸러내기 때문에 ON에 두었습니다.
*/