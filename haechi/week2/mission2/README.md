# 2주차 백엔드 미션 – SQL 조회 (온라인 도서 대여 시스템)

1주차 기준 ERD를 MySQL로 구현하고, 화면 요구사항을 SELECT / JOIN / WHERE / ORDER BY / LIMIT으로 조회했습니다.

## 실행 순서

1. `01_schema.sql` – 공통 DB(umc_book)와 테이블 생성
2. `02_seed.sql` – 공통 더미 데이터 입력
3. `mission1.sql` ~ `mission3.sql` – 공통 미션 조회
4. `extension.sql` – 내 1주차 ERD(umc_mission) 생성 + 더미 데이터 + 확장 조회

![스키마·시드 실행 확인]

## 미션 1 – 문학 카테고리 대여 가능 도서 (최신순 10개)

기준 테이블은 book이며, 카테고리 이름이 category 테이블에 있어 `book.category_id = category.category_id`로 JOIN했습니다. WHERE에서 카테고리 이름이 '문학'이고 `is_available = TRUE`인 책만 남겼습니다. 등록일 컬럼이 없어 AUTO_INCREMENT인 book_id 내림차순을 최신순으로 사용하고, `LIMIT 10`으로 첫 페이지만 가져왔습니다.

![미션 1 결과]

> 검증: 문학 책 2권 중 대여 가능한 '달빛 도서관' 1건만 나와 요구사항과 일치합니다.

## 미션 2 – 미반납 도서 (반납 예정일순)

기준 테이블은 대여 기록인 rental이며, 책 제목이 필요해 `rental.book_id = book.book_id`로 JOIN했습니다. WHERE에서 user_id로 사용자를 고정하고, 미반납은 `returned_at IS NULL`로 걸렀습니다(`= NULL`은 참이 되지 않음). 반납 예정일 오름차순에 rental_id를 보조 정렬로 두었습니다.

![미션 2 결과]

> 검증: 사용자 1의 미반납 도서 '겨울의 편지' 1건이 나와 요구사항과 일치합니다.

## 미션 3 – 도서 태그 + 좋아요 여부

기준 테이블은 book이며, 태그는 N:M이라 `book → book_tag → tag`로, 좋아요는 book_like를 LEFT JOIN해 매칭 여부로 판단했습니다. 태그나 좋아요가 없어도 책이 결과에서 빠지지 않도록 LEFT JOIN을 쓰고, 사용자 조건은 WHERE가 아닌 ON에 두었습니다. book_like의 PK가 (user_id, book_id)라 사용자를 고정하면 매칭 행이 최대 1개이므로 중복 행이 생기지 않습니다.

![미션 3 결과]

> 검증: '달빛 도서관'의 태그 소설·추천 2행과 좋아요 1이 나와 요구사항과 일치합니다.

## 확장 – 내 1주차 ERD: 진행 중인 미션 목록

요구사항: "로그인한 사용자가 진행 중인 미션을 최근에 시작한 순으로 10개 보여 준다."

기준 테이블은 회원과 미션의 N:M 관계를 담은 member_mission이며, 미션 내용·보상은 mission에, 가게 이름은 store에 있어 `member_mission → mission → store` 순서로 JOIN했습니다. WHERE에서 로그인한 회원, 진행 중 상태, 삭제되지 않은 미션(`deleted_at IS NULL`)으로 좁혔습니다. 최근 시작순(created_at 내림차순)에 member_mission_id를 보조 정렬로 두고 LIMIT/OFFSET으로 페이지를 나눴습니다.

![확장 쿼리 결과]

> 검증: 회원 1의 진행 중 미션 3개 중 삭제된 미션을 제외한 2건이 최신순으로 나와 요구사항과 일치합니다.
