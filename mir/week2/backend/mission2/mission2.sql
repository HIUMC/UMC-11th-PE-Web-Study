-- 2. 내가 대여 중인 책
SELECT 
    b.title, 
    r.rented_at, 
    r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1 /* 로그인한 사용자 ID 입력 부분 */
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

/*
기준 테이블은 대여 이력을 관리하는 `rental`이며, 어떤 책을 빌렸는지 제목을 표시하기 위해 `book` 테이블을 JOIN했습니다.
현재 로그인한 특정 사용자(`user_id = 1`)의 기록 중에서 아직 반납이 완료되지 않은(`returned_at IS NULL`) 책만 WHERE 조건으로 추출했습니다.
반납일이 임박한 순서대로 사용자에게 보여주기 위해 반납 예정일(`due_at`) 기준 오름차순(ASC)으로 정렬했습니다.
*/