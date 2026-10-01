# 3주차 백엔드 미션 — Spring Boot + JdbcTemplate (Raw SQL)

2주차 SQL을 서버 API로 옮긴 미션. Controller(요청/응답) / Service(로직) / Repository(SQL) 3계층으로 분리했어요.

## 실행
1. 2주차 `01_schema.sql`, `02_seed.sql`로 `book_rental` DB 준비
2. 환경변수 `DB_USER`, `DB_PASSWORD` 설정
3. IntelliJ로 열거나 `./gradlew bootRun` → http://localhost:8080

## API
- GET  /books                  전체 도서
- GET  /books/category/{id}    카테고리별 도서
- POST /books                  도서 등록 (201)
- POST /rentals                대여 생성 (201)  body: { "userId":1, "bookId":3 }
- PATCH /rentals/{id}/return   반납 처리 (없으면 404)

## 포인트
- `?` 파라미터 바인딩으로 SQL Injection 방어
- DB 비밀번호는 `application.yml`에서 환경변수로 분리
- 대여일/반납예정일은 DB의 NOW(), DATE_ADD로 계산
- 반납은 영향 행 수 0이면 404 (returned_at IS NULL 조건)
