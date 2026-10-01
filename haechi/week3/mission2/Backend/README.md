# 3주차 백엔드 미션 – 생 SQL로 만드는 첫 API (Spring Boot)

2주차에 Workbench에서 직접 실행하던 SQL을 서버 코드(JdbcTemplate) 안에서 실행하는 API로 만들었습니다.
DTO·ORM 없이 `Map` + Raw SQL로 Controller – Service – Repository 3계층을 구성했습니다.

## 실행 방법

1. 2주차 `01_schema.sql` → `02_seed.sql` 실행 (DB: `umc_book`)
2. `.env.example`을 복사해 `.env`를 만들고 `DB_PASSWORD` 입력
3. `StudyApplication` 실행 → `http://localhost:8080`

> DB 비밀번호는 `application.yml`에 하드코딩하지 않고 `${DB_PASSWORD}` 환경변수로 분리했습니다.
> `.env`는 `.gitignore`에 등록해 깃허브에 올라가지 않으며, 대신 키 목록만 담은 `.env.example`을 올렸습니다.

## 폴더 구조

```
src/main/java/com/umc/study
├── controller   # 요청을 받고 응답(JSON)을 돌려주는 계층
│   ├── BookController.java
│   └── RentalController.java
├── service      # 비즈니스 규칙 (예: 반납할 기록이 없으면 404)
│   ├── BookService.java
│   └── RentalService.java
└── repository   # SQL을 실행하는 유일한 계층 (JdbcTemplate)
    ├── BookRepository.java
    └── RentalRepository.java
```

## API 목록

| 구분 | Method | URL | 설명 | 성공 코드 |
|---|---|---|---|---|
| 실습 1 | GET | `/books` | 도서 전체 조회 | 200 |
| 실습 2 | POST | `/books` | 신규 도서 등록 | 200 |
| 미션 1 | GET | `/books/category/{categoryId}` | 카테고리별 도서 조회 | 200 |
| 미션 2 | POST | `/rentals` | 대여 기록 생성 | 201 |
| 선택 | PATCH | `/rentals/{rentalId}/return` | 반납 처리 | 200 |

---

## 실습 1·2 – GET /books, POST /books

워크북대로 `SELECT * FROM book`을 `queryForList`로, `INSERT`를 `update`로 실행했습니다.
INSERT에서는 문자열 더하기 대신 `?` 파라미터 바인딩을 사용해 SQL Injection을 막았고, AUTO_INCREMENT인 `book_id`는 생략했습니다.




> 검증: seed 기준 3권이 조회되고, POST 후 다시 조회하면 `book_id: 4` '클린 코드'가 추가되어 있습니다.

## 미션 1 – 특정 카테고리 도서 목록 (GET /books/category/{categoryId})

```sql
SELECT * FROM book WHERE category_id = ? ORDER BY book_id
```

경로 변수 `categoryId`를 `@PathVariable`로 받아 `?`에 바인딩했습니다.
2주차 mission1은 카테고리 **이름**('문학')으로 조건을 걸어 category 테이블과 JOIN했지만, 이번에는 **id**를 직접 받으므로 book 테이블만으로 조회할 수 있어 JOIN이 필요 없습니다.



> 검증: `/category/1` → 문학 도서(달빛 도서관, 겨울의 편지 + 실습에서 등록한 클린 코드), `/category/2` → 우주를 읽는 법.
> 존재하지 않는 `/category/999`는 에러가 아니라 빈 배열 `[]`과 200을 반환합니다.

## 미션 2 – 대여 기록 생성 (POST /rentals)

```sql
INSERT INTO rental (user_id, book_id, rented_at, due_at)
VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
```

- 대여는 도서와 다른 자원이라 Rental 3계층을 별도로 만들었습니다.
- `rented_at`은 현재 시간, `due_at`은 7일 뒤로 DB 함수가 계산하고, `returned_at`은 NULL 허용이라 생략했습니다.
- `KeyHolder`로 생성된 `rental_id`를 받아 응답에 담았습니다. 생성 요청이므로 `201 Created`로 응답합니다.

요청 Body:

```json
{ "userId": 2, "bookId": 3 }
```


> 검증: 응답으로 `rentalId: 3`을 받았고, `SELECT * FROM rental;`에서 `due_at`이 `rented_at`보다 정확히 7일 뒤인 것을 확인했습니다.


## 선택 미션 – 반납 처리 (PATCH /rentals/{rentalId}/return)

```sql
UPDATE rental SET returned_at = NOW()
WHERE rental_id = ? AND returned_at IS NULL
```

- 미션 쿼리에 `AND returned_at IS NULL`을 추가해, 이미 반납된 기록의 반납일이 덮어써지지 않게 했습니다.
- `jdbcTemplate.update()`가 반환하는 영향 행 수가 0이면(없는 id 또는 이미 반납됨) Service에서 404를 던집니다. 비즈니스 규칙은 Service에 둔다는 3계층 원칙을 적용했습니다.



> 검증: `PATCH /rentals/3/return` → 200, 같은 요청을 한 번 더 보내면 → 404.

---


## 복습

- 응답 키가 `book_id`, `is_available`처럼 DB 컬럼명 그대로 노출되어 DB와 프론트가 강하게 결합됨
- `?`와 파라미터 순서를 눈으로 맞춰야 해서 컬럼이 많아지면 실수하기 쉬움
- 대여 중인 책(`is_available = FALSE`)도 대여가 되고, 대여·반납 시 `is_available`이 바뀌지 않음
  → Service에서 대여 가능 여부를 검증하고 `@Transactional`로 두 테이블을 함께 갱신해야 데이터가 일관됨
