USE umc_week2;

SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rental r
JOIN book b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;

/*
기준 테이블은 rental이며, 대여 내역에 있는 book_id를 통해 실제 책 제목을 가져오기 위해 book 테이블을 JOIN했습니다. 
WHERE에서는 특정 사용자의 대여 내역 중 returned_at IS NULL인 미반납 도서만 조회하고, 
반납 예정일인 due_at 기준 오름차순으로 정렬합니다.
*/