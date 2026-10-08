# Week 4

## BE

### 주제

TypeORM을 활용한 ORM 기반 도서 API 리팩터링

### 구현 내용

- `Book`, `Category` 엔티티 및 관계 구현
- TypeORM Repository를 활용한 `GET /books`
- DTO와 Validation을 적용한 `POST /books`
- 존재하지 않는 카테고리 예외 처리
- `BookResponseDto`를 통한 응답 형식 분리

### 학습 내용

- Raw SQL과 ORM 방식의 차이
- Entity와 Repository의 역할
- DTO를 활용한 API 요청/응답 구조 설계
- `ValidationPipe`를 활용한 요청 데이터 검증
