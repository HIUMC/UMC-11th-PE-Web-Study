# 2주차 백엔드 미션 — SQL 조회 (온라인 도서 대여 시스템)

1주차 기준 ERD를 MySQL로 구현하고, 화면 요구사항을 SELECT/JOIN/WHERE/ORDER BY/LIMIT으로 조회했어요.

## 실행 순서

## 미션 1 — 문학 카테고리 대여 가능 도서 (최신순 10개)
- **기준 테이블**: `book` (화면 주 데이터가 도서 목록)
- **JOIN**: 카테고리 이름은 `category`에 있어 `book → category`(FK category_id)
- **WHERE**: `c.name = '문학' AND b.is_available = TRUE`
- **정렬·범위**: `book_id DESC`, `LIMIT 10`
- **결과**: 달빛 도서관 / 소설 / 문학  (겨울의 편지는 대여불가라 제외 → 요구사항 일치)

## 미션 2 — 미반납 도서 (반납예정일 순)
- **기준 테이블**: `rental` (대여 내역이 주 데이터)
- **JOIN**: 책 제목이 필요해 `rental → book`(FK book_id)
- **WHERE**: `user_id = 1 AND returned_at IS NULL` (NULL은 `=`로 못 비교 → `IS NULL`)
- **정렬**: `due_at ASC`
- **결과**: 겨울의 편지 / 2026-08-10 / 2026-08-17

## 미션 3 — 특정 책의 태그 + 특정 사용자 좋아요 여부
- **기준 테이블**: `book`
- **JOIN**: 태그는 N:M이라 `book → book_tag → tag`, 좋아요는 `book_like`를 **LEFT JOIN**
  (좋아요가 없어도 태그 행은 남겨야 해서 LEFT JOIN, 사용자 조건은 WHERE가 아니라 ON에)
- **WHERE**: `book_id = 1`
- **결과**: 달빛 도서관 / 소설 / 1, 달빛 도서관 / 추천 / 1

## 확장 — 내 1주차 ERD (미션 리워드 앱)
- **요구사항**: 특정 회원이 진행 중인 미션을 가게 이름과 함께 최신순으로
- **기준 테이블**: `member_mission` (수행 내역, 매핑 테이블)
- **JOIN**: `member_mission → mission → store`
- **WHERE**: `member_id = 1 AND status = 0`(진행중), **정렬**: `created_at DESC`
- **결과**: 안양국밥/200/0, 명지김밥/100/0 (완료한 평촌떡볶이 제외)

## 미션 기록 답변
- 어떤 테이블 기준으로 시작? → 화면 주 데이터가 있는 테이블(도서=book, 대여=rental, 수행내역=member_mission)
- JOIN 이유? → 필요한 컬럼이 다른 테이블에 있을 때만 ERD의 PK/FK 방향대로 연결
- 결과가 예상과 달랐을 때? → 미션3에서 좋아요 조건을 WHERE에 뒀더니 행이 사라져 ON으로 옮겨 해결
