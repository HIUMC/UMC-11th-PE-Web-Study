SELECT b.title, b.description, c.name
FROM book b JOIN category c ON b.category_id = c.category_id
WHERE is_available = TRUE AND c.name ='문학'
ORDER BY book_id DESC;
// 책 제목과 설명이 있는 book table과 카테고리 이름이 있는
// category table을 JOIN하여 카테고리 이름이 문학인 경우에
// 책 제목과 설명, 카테고리 이름을 출력하는 SQL 쿼리를 작성했습니다.