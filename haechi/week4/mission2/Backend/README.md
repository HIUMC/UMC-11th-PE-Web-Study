# 4주차 백엔드 미션 – Raw SQL API를 JPA(ORM)로 리팩터링 (Spring Boot)

3주차에 JdbcTemplate + Raw SQL + `Map`으로 만든 도서 API를 **Entity · DTO · JpaRepository** 기반으로 바꿨습니다.
3주차 Raw SQL 코드는 그대로 두고, 복사본에서 ORM 버전을 작성했습니다. (Rental API는 이번 미션 범위가 아니라 3주차 코드 그대로 유지)

## 실행 방법

1. 2주차 `01_schema.sql` → `02_seed.sql` 실행 (DB: `umc_book`)
2. `.env.example`을 복사해 `.env`를 만들고 `DB_PASSWORD` 입력
3. `StudyApplication` 실행 → `http://localhost:8080`

> `ddl-auto: validate`라 서버가 테이블을 바꾸지 않고, 엔티티와 테이블 구조가 다르면 실행 시점에 바로 에러가 납니다.
> `gradle test`로 H2 인메모리 DB에서 GET·POST·오류 시나리오를 한 번에 확인할 수 있습니다.

## 폴더 구조

```
src/main/java/com/umc/study
├── entity       # 테이블 ↔ 클래스 (Book, Category)
├── dto          # API 요청·응답의 약속 (CreateBookRequest, BookResponse)
├── repository   # JpaRepository 인터페이스 (SQL 문자열 없음)
├── service      # 카테고리 존재 확인, 엔티티 → DTO 변환, 트랜잭션
├── controller   # 요청 검증(@Valid), 상태 코드
└── exception    # 전역 예외 처리 (400 / 404 JSON 응답)
```

## API 목록

| Method | URL | 설명 | 성공 코드 | 실패 코드 |
|---|---|---|---|---|
| GET | `/books` | 도서 전체 최신순 조회 | 200 | - |
| POST | `/books` | 신규 도서 등록 | **201** | 400 (검증 실패), 404 (없는 카테고리) |
| GET | `/books/category/{categoryId}` | 카테고리별 도서 (3주차 미션 → JPA) | 200 | - |

---

## 1. Entity – Book, Category 다대일 관계

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "category_id", nullable = false)
private Category category;
```

- `category 1 : N book`을 `@ManyToOne`으로 옮겨, FK 숫자 대신 `Category` 객체를 들고 있게 했습니다.
- `book_id`, `is_available`처럼 snake_case 컬럼은 `@Column(name = ...)`으로 camelCase 필드와 명시적으로 매핑했습니다.
- `@NoArgsConstructor(access = PROTECTED)`로 JPA용 기본 생성자만 열어두고, 실제 생성은 `new Book(category, title, description)`만 쓰게 했습니다.

## 2. DTO – 요청 검증과 응답 모양

```java
public record CreateBookRequest(
        @NotNull Long categoryId,
        @NotBlank @Size(max = 100) String title,
        String description
) {}
```

- Controller의 `@Valid`가 Service 호출 전에 검증하고, 실패하면 `GlobalExceptionHandler`가 필드별 이유를 담아 400을 돌려줍니다.
- 응답은 `BookResponse`(`bookId`, `title`, `description`, `categoryName`, `isAvailable`)로만 내보내 DB 컬럼명이 API에 노출되지 않습니다.

## 3. Repository – SQL 문자열 대신 메서드 이름

```java
@EntityGraph(attributePaths = "category")
List<Book> findAllByOrderByBookIdDesc();
```

- 3주차의 `SELECT * FROM book` + `queryForList`가 메서드 하나로 바뀌었습니다.
- 응답에 `categoryName`이 필요해 `@EntityGraph`로 category를 JOIN해서 한 번에 가져왔습니다. 없으면 책 N권마다 카테고리 조회 쿼리가 따로 나가는 **N+1**이 생깁니다. (`show-sql: true`로 쿼리 1번만 나가는 것 확인)

## 4. Service / Controller – GET /books, POST /books

```java
@Transactional
public BookResponse createBook(CreateBookRequest request) {
    Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));
    Book book = new Book(category, request.title(), request.description());
    return BookResponse.from(bookRepository.save(book));
}
```

- 없는 카테고리는 저장 전에 걸러 404로 응답합니다. (3주차에는 FK 제약 에러가 그대로 500으로 나갔음)
- POST는 `@ResponseStatus(HttpStatus.CREATED)`로 201을 반환하고, 문자열 메시지 대신 등록된 도서 정보를 응답합니다.

---

## Postman 결과

### GET /books → 200

![GET /books]

```json
[
  { "bookId": 3, "title": "우주를 읽는 법", "description": "과학 교양", "categoryName": "과학", "isAvailable": true },
  { "bookId": 2, "title": "겨울의 편지", "description": "에세이", "categoryName": "문학", "isAvailable": false },
  { "bookId": 1, "title": "달빛 도서관", "description": "소설", "categoryName": "문학", "isAvailable": true }
]
```

### POST /books → 201

![POST /books 201]

```json
// 요청
{ "categoryId": 2, "title": "클린 코드", "description": "개발 도서" }
// 응답 201
{ "bookId": 4, "title": "클린 코드", "description": "개발 도서", "categoryName": "과학", "isAvailable": true }
```

### 없는 카테고리 → 404

![POST /books 404]

```json
{ "status": 404, "code": "CATEGORY_NOT_FOUND", "message": "존재하지 않는 카테고리입니다. (categoryId: 999)", "errors": {} }
```

### 빈 제목 + categoryId 누락 → 400

![POST /books 400]

```json
// 요청
{ "title": "  " }
// 응답 400
{
  "status": 400, "code": "INVALID_REQUEST", "message": "요청 값이 올바르지 않습니다.",
  "errors": { "categoryId": "categoryId는 필수입니다.", "title": "title은 비어 있을 수 없습니다." }
}
```

> 검증: GET은 4개 필드를 book_id 최신순으로, POST는 201과 등록된 도서를, 없는 카테고리·빈 제목은 각각 404·400을 반환해 요구사항과 일치합니다.

---

## 3주차 Raw SQL과 비교해 바뀐 점

1. 3주차에는 SQL 문자열과 `?` 파라미터 순서를 눈으로 맞춰야 했지만, 이제는 `Book` 엔티티에 테이블 구조를 한 번 정의하고 `findAllByOrderByBookIdDesc()`, `save()` 같은 Repository 메서드로 조회·저장을 표현합니다.
2. 3주차에는 `Map`을 그대로 반환해 `book_id`, `is_available` 같은 DB 컬럼명이 응답 키가 되었지만, 이제는 `BookResponse` DTO로 API 계약을 분리해 DB 컬럼명을 바꿔도 응답 모양은 유지됩니다.
3. 3주차에는 `categoryId`가 비어 있거나 없는 카테고리여도 일단 INSERT를 시도해 500 에러가 났지만, 이제는 `@Valid`로 형식을 먼저 검증(400)하고 Service에서 카테고리 존재를 확인(404)해 원인이 드러나는 오류를 돌려줍니다.
4. 대신 ORM이 SQL을 대신 만들어 주는 만큼, 연관 관계를 조회할 때 쿼리가 몇 번 나가는지(N+1) 직접 로그로 확인하는 습관이 필요하다는 것을 알게 됐습니다.
