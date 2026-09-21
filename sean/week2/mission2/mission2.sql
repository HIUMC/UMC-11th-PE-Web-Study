SELECT 
    b.title, 
    r.rented_at, 
    r.due_at 
FROM rental r
JOIN book b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
    AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

/* 대여일, 반납 예정일처럼 대여에 관한 내용이므로 rental을 기준 테이블로 설정했습니다. 책 제목에 관한 내용은 book 테이블에 있기 때문에 book을 JOIN 하였습니다.
    특정 사용자의 대여에 대한 조회이므로 rental.user_id = 1, 그리고 아직 반납하지 않은 책이어야 하므로 rental.returned_at IS NULL을 조건으로 사용하였습니다.
    반납 예정일 순이므로 rental.due_at ASC를 사용하였습니다.
*/