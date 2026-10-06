# 4주차 미션 — Spring Boot JPA로 도서 API 전환

3주차 `JdbcTemplate` + Raw SQL로 만든 `GET /books`, `POST /books`를 Spring Data JPA로 다시 구현했습니다.

## 1. 구현 내용

| 계층 | 파일 | 역할 |
|---|---|---|
| Entity | `entity/Book.java`, `entity/Category.java` | `book`, `category` 테이블 매핑, `@ManyToOne` + `@JoinColumn(name = "category_id")`로 다대일 관계 표현 |
| DTO | `dto/CreateBookRequest.java` | `categoryId` `@NotNull`, `title` `@NotBlank` + `@Size(max = 100)`, `description` 선택 |
| DTO | `dto/BookResponse.java`, `dto/ErrorResponse.java` | `bookId`, `title`, `description`, `categoryName`, `isAvailable` 응답 / 오류 응답 |
| Repository | `repository/BookRepository.java`, `repository/CategoryRepository.java` | `JpaRepository` 상속, `findAllByOrderByBookIdDesc()` (+ `@EntityGraph`로 N+1 방지) |
| Service | `service/BookService.java` | 카테고리 존재 확인 → 엔티티 생성·저장 → DTO 변환, `@Transactional` |
| Controller | `controller/BookController.java` | `GET /books`, `POST /books` (`@Valid`, `@ResponseStatus(CREATED)`) |
| Exception | `exception/GlobalExceptionHandler.java` | 없는 카테고리 → 404, 검증 실패 → 400 |

설정 (`application.yaml`): `ddl-auto: validate`, `open-in-view: false` — 기존 테이블을 그대로 쓰고, 엔티티와 구조가 다르면 실행 시점에 실패합니다.

## 2. 실행 결과

Postman 컬렉션: `postman/week4-books.postman_collection.json` (Import 후 순서대로 실행)

### GET /books — 200 OK (최신 등록순)
```json
[
  {"bookId":5,"title":"클린 코드","description":"애자일 소프트웨어 장인 정신","categoryName":"문학","isAvailable":true},
  {"bookId":3,"title":"우주를 읽는 법","description":"과학 교양","categoryName":"과학","isAvailable":true},
  {"bookId":2,"title":"겨울의 편지","description":"에세이","categoryName":"문학","isAvailable":false},
  {"bookId":1,"title":"달빛 도서관","description":"소설","categoryName":"문학","isAvailable":true}
]
```

### POST /books — 201 Created
요청: `{"categoryId":2,"title":"ORM 입문","description":"JPA 실습"}`
```json
{"bookId":6,"title":"ORM 입문","description":"JPA 실습","categoryName":"과학","isAvailable":true}
```

### POST /books — 404 Not Found (없는 카테고리)
요청: `{"categoryId":999,"title":"없는 카테고리"}`
```json
{"status":404,"message":"존재하지 않는 카테고리입니다. categoryId=999"}
```

### POST /books — 400 Bad Request (빈 제목)
요청: `{"categoryId":1,"title":"  "}`
```json
{"status":400,"message":"title: 제목은 비어 있을 수 없습니다."}
```

## 3. 3주차 Raw SQL과 비교해 바뀐 점

1. 3주차에는 `"INSERT INTO book (...) VALUES (?, ?, ?, true)"` 같은 SQL 문자열과 `?` 파라미터 순서를 직접 관리했지만, 이번에는 `Book` 엔티티를 만들어 `bookRepository.save()`만 호출하면 JPA가 INSERT를 생성합니다.
2. 3주차에는 `Map<String, Object>`로 요청을 받고 `SELECT *` 결과를 그대로 응답해 DB 컬럼명(`book_id`, `category_id`)이 API에 노출됐지만, 이번에는 `CreateBookRequest` / `BookResponse` DTO로 API 계약을 DB 구조와 분리했습니다.
3. 3주차에는 FK인 `category_id` 숫자만 다뤘지만, 이번에는 `@ManyToOne`으로 `Book`이 `Category` 객체를 참조하므로 JOIN SQL 없이 `book.getCategory().getName()`으로 카테고리 이름을 응답할 수 있습니다.
4. 3주차에는 검증이 없어 공백 제목은 그대로 저장되고 없는 카테고리는 FK 제약 위반으로 500 오류가 났지만, 이번에는 `@Valid`로 Service 진입 전에 400을, 카테고리 존재 확인으로 404를 명확하게 응답합니다.
5. 다만 ORM도 내부적으로 SQL을 실행하므로, `show-sql`로 쿼리를 확인하고 LAZY 로딩으로 생기는 N+1 문제를 `@EntityGraph`로 해결하는 등 SQL 이해는 여전히 필요했습니다.

## 4. 검증

`GET /books`는 도서 ID·제목·설명·카테고리 이름·대여 가능 여부를 최신순으로 반환했고, `POST /books`는 정상 요청에 201, 없는 카테고리에 404, 빈 제목에 400을 반환해 실행 결과가 요구사항과 일치함을 확인했습니다.

## 실행 방법

환경 변수 `DB_URL`, `DB_USER`, `DB_PW`를 설정한 뒤 실행합니다.
```bash
./gradlew bootRun
```
