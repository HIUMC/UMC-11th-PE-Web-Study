USE umc_week2_books;

-- 연습: 대여 가능한 책의 제목과 설명을 최신순으로 조회
SELECT book_id, title, description
FROM book
WHERE is_available = TRUE
ORDER BY book_id DESC;

-- 미션 1: 문학 카테고리의 대여 가능한 책을 최신순으로 최대 10권 조회
SELECT b.book_id, b.title, b.description, c.name AS category_name
FROM book AS b
JOIN category AS c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- 미션 2: 민서가 아직 반납하지 않은 책을 반납 예정일 순으로 조회
SELECT b.title, r.rented_at, r.due_at
FROM rental AS r
JOIN book AS b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;

-- 미션 3: 1번 책의 태그와 1번 사용자의 좋아요 여부
SELECT
  b.title,
  t.name AS tag_name,
  CASE
    WHEN bl.user_id IS NOT NULL THEN TRUE
    ELSE FALSE
  END AS is_liked
FROM book AS b
LEFT JOIN book_tag AS bt ON b.book_id = bt.book_id
LEFT JOIN tag AS t ON bt.tag_id = t.tag_id
LEFT JOIN book_like AS bl
  ON b.book_id = bl.book_id AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id;