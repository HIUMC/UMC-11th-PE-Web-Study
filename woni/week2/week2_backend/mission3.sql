-- Mission 3. 특정 책의 태그 목록과 특정 사용자의 좋아요 여부를 조회
-- 결과: 책 제목, 태그 이름, 좋아요 여부

USE umc_week2;

SELECT b.title,
       t.name AS tag_name,
       (bl.user_id IS NOT NULL) AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id
                      AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.name ASC;

-- [설명]
-- 상세 화면의 대상이 책이므로 book을 기준 테이블로 두고, book과 tag는 N:M 관계라
-- 중간 테이블 book_tag를 거쳐 tag까지 JOIN했으며 좋아요 여부는 book_like와 연결했다.
-- 태그나 좋아요가 없어도 책은 보여야 하므로 LEFT JOIN을 사용했고, 특정 사용자 조건(user_id = 1)은
-- WHERE가 아닌 ON에 두어 좋아요가 없을 때도 행이 사라지지 않게 했다.
-- WHERE에서는 선택한 책(book_id = 1)만 남기고, 태그 이름 오름차순으로 정렬해 순서를 고정했다.
--
-- [실행 결과] 2행 (is_liked: 1 = 좋아요, 0 = 좋아요 안 함)
-- title       | tag_name | is_liked
-- 달빛 도서관 | 소설     | 1
-- 달빛 도서관 | 추천     | 1
--
-- [검증]
-- book_tag에 달빛 도서관(1)의 태그는 소설, 추천 2개이고 book_like에 (user 1, book 1)이 있으므로
-- 태그 2행과 좋아요 여부 1이 조회된 결과가 요구사항과 일치한다.
