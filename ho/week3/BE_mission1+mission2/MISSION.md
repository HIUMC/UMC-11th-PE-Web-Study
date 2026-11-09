# 4주차 ORM 미션 제출 정리

## 핵심 코드

- Entity: `src/main/java/com/umc/hoStudy/domain/Book.java`, `Category.java`
- DTO: `src/main/java/com/umc/hoStudy/dto/book/CreateBookRequest.java`, `BookResponse.java`
- Repository: `src/main/java/com/umc/hoStudy/repository/BookRepository.java`, `CategoryRepository.java`
- Service: `src/main/java/com/umc/hoStudy/service/BookService.java`
- Controller: `src/main/java/com/umc/hoStudy/controller/BookController.java`
- Exception: `src/main/java/com/umc/hoStudy/exception/CategoryNotFoundException.java`

## Postman 확인 항목

### GET /books 성공

- Method: `GET`
- URL: `http://localhost:8080/books`
- 기대 상태: `200 OK`
- 기대 결과: `bookId` 내림차순이며 `bookId`, `title`, `description`, `categoryName`, `isAvailable`을 포함한다.

### POST /books 성공

- Method: `POST`
- URL: `http://localhost:8080/books`
- Body (`raw`, `JSON`):

```json
{
  "categoryId": 1,
  "title": "ORM 실습 도서",
  "description": "JPA로 등록한 도서"
}
```

- 기대 상태: `201 Created`
- 기대 결과: 저장된 도서의 `BookResponse`가 반환된다.

### 잘못된 요청

```json
{
  "categoryId": null,
  "title": "",
  "description": "검증 실패 예시"
}
```

- 기대 상태: `400 Bad Request`

### 존재하지 않는 카테고리

```json
{
  "categoryId": 999999,
  "title": "존재하지 않는 카테고리 도서",
  "description": null
}
```

- 기대 상태: `404 Not Found`

## 3주차 Raw SQL 방식과 달라진 점

3주차에는 `JdbcTemplate`에서 SQL 문자열과 파라미터를 직접 작성했지만, 이번에는 엔티티와 `JpaRepository`를 이용해 데이터베이스 작업을 수행한다. 조회 결과를 `Map<String, Object>`로 다루지 않고 `Book`과 `Category` 객체의 관계로 표현하므로 코드에서 데이터 구조와 연관관계가 더 명확해졌다. 요청과 응답에는 엔티티를 직접 노출하지 않고 DTO를 사용하여 입력 검증과 API 응답 형식을 데이터베이스 구조로부터 분리했다. 또한 `@Transactional`을 통해 조회와 저장 작업의 트랜잭션 범위를 선언적으로 관리한다.

## 실행 결과 검증

도서 목록은 최신순의 `BookResponse`로 반환되고, 정상 등록은 `201 Created`, 잘못된 입력은 `400 Bad Request`, 존재하지 않는 카테고리는 `404 Not Found`로 처리되어 요구사항과 일치한다.

> 위 세 Postman 요청을 로컬 데이터베이스와 애플리케이션을 실행한 상태에서 호출한 뒤 결과 화면을 캡처하여 제출물에 첨부한다.
