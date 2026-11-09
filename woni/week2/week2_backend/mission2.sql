-- Mission 2. 특정 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 조회
-- 결과: 책 제목, 대여일, 반납 예정일

USE umc_week2;

SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

-- [설명]
-- 대여 여부와 반납 여부는 대여 기록에 있으므로 rental을 기준 테이블로 두고,
-- 책 제목은 book에만 있어 rental의 FK(book_id)와 book의 PK를 ON으로 연결해 JOIN했다.
-- WHERE에서 특정 사용자(user_id = 1)의 기록 중 반납일이 비어 있는(returned_at IS NULL) 대여만 남겼으며,
-- NULL은 = 로 비교할 수 없어 IS NULL을 사용했다.
-- 반납이 급한 책부터 보이도록 due_at 오름차순으로 정렬했다.
--
-- [실행 결과] 1행
-- title       | rented_at           | due_at
-- 겨울의 편지 | 2026-08-10 10:00:00 | 2026-08-17 10:00:00
--
-- [검증]
-- 민서(user_id = 1)의 대여 기록은 '겨울의 편지' 1건이며 returned_at이 NULL이므로
-- 미반납 도서 1건이 조회된 결과가 요구사항과 일치한다.
