-- 미션 2: 사용자(1번)가 아직 반납하지 않은 책을 반납 예정일 순으로 조회
-- 결과: 책 제목, 대여일, 반납 예정일
USE umc_book;

SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;
