SELECT b.title, r.rented_at, r.due_at
FROM book b JOIN rental r ON b.book_id = r.book_id
WHERE b.is_available = FALSE AND r.returned_at IS NULL
ORDER BY r.due_at ASC;
// 책 제목과 대여일, 반납 예정일이 있는 book table과 rental tabele을
// JOIN하였고 특정 사용자가 아직 반납하지 않았으면 대여가 불가능하기에
// is_available이 FALSE인 wheer 조건을 걸었고 반납 예정일 오름차순으로
// SQL 쿼리를 작성했습니다.