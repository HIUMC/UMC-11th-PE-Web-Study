USE umc_books_week2;

-- 공통 데이터의 사용자 1과 책 1을 기준으로 확인한다.
-- 실제 앱에서는 로그인 사용자 ID를 검증된 입력에서 바인딩해야 한다.
SET @viewer_id = 1;
SET @book_id = 1;

-- 미션 1: 문학 중 대여 가능, 책 ID 기준 최신 10권.
SELECT b.title, b.description, c.name AS category_name
FROM book AS b
JOIN category AS c ON c.category_id = b.category_id
WHERE c.name = '문학' AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- 미션 2: 사용자 1의 반납하지 않은 대여.
SELECT b.title, r.rented_at, r.due_at
FROM rental AS r
JOIN book AS b ON b.book_id = r.book_id
WHERE r.user_id = @viewer_id AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;

-- 미션 3: 책 1의 각 태그와 사용자 1의 좋아요 여부.
-- 태그 수만큼 행을 반환하며 좋아요 여부는 각 행에 반복해 표시한다.
SELECT b.title, t.name AS tag_name, (bl.user_id IS NOT NULL) AS is_liked
FROM book AS b
LEFT JOIN book_tag AS bt ON bt.book_id = b.book_id
LEFT JOIN tag AS t ON t.tag_id = bt.tag_id
LEFT JOIN book_like AS bl
  ON bl.book_id = b.book_id AND bl.user_id = @viewer_id
WHERE b.book_id = @book_id
ORDER BY t.tag_id ASC;
