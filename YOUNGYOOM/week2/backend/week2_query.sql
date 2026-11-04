USE mydb;
SHOW TABLES;



SELECT b.title AS "책 제목", b.description AS "설명", c.name AS "카테고리"
FROM book b 
JOIN category c ON b.category_id = c.category_id #book 테이블에는 cateogory 이름이 없으므로 category 테이블과 JOIN
WHERE c.name = '문학' AND b.is_available = TRUE #문학이고, 대여 가능한 책만 
ORDER BY b.book_id DESC 
LIMIT 10; #최신순으로 LIMIT 10


SELECT b.title  AS "책 제목", r.rented_at  AS "대여일", r.due_at AS "반납 예정일"
FROM rental r 
JOIN book b ON r.book_id = b.book_id #책 제목을 가져오기 위해 book 테이블과 JOIN
WHERE r.user_id = 1 AND r.returned_at IS NULL ##특정 사용자(id=1) 이고, 반납일이 NULl인(반납하지 않은) 책만
ORDER BY r.due_at ASC; #반납 예정일 기준으로 오름차순

SELECT b.title, t.name AS tag_name, CASE WHEN bl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
FROM book b
JOIN book_tag bt ON b.book_id = bt.book_id #book과 tag는 N:M이므로 book_tag를 거쳐야됨
JOIN tag t ON bt.tag_id = t.tag_id #book_tag 테이블엔 tag_id만 있어서, 태그 이름 가져올려면 tag 테이블과 조인
LEFT JOIN book_like bl ON bl.book_id = b.book_id AND bl.user_id = 1 #book_like 여부 확인할려면, 그 테이블에 있는지 봐야되는데, 좋아요가 없어도 태그목록이 나와야되니까 left_join, 특정 사용자(id=1)의 좋아요여부
WHERE b.book_id = 1;  #특정 책(id=1)만
