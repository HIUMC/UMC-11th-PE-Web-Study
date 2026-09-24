# 1주차 백엔드 - ERD 설계

## 1. 과제 개요

온라인 도서 대여 관리 시스템의 요구사항을 분석하고, 필요한 데이터를 테이블로 분리하여 ERD를 설계하였다.

주요 기능은 다음과 같다.

- 카카오 소셜 로그인
- 회원 정보 관리 및 회원 탈퇴
- 도서 및 카테고리 관리
- 도서 대여
- 도서 해시태그
- 도서 좋아요
- 알림 관리

---

## 2. 요구사항 분석

### 사용자

- 카카오 소셜 로그인을 지원한다.
- 이름, 닉네임, 전화번호, 성별 정보를 저장한다.
- 회원 탈퇴 기능을 지원한다.

회원 탈퇴 시 데이터를 바로 삭제하지 않고 `deleted_at`을 이용한 Soft Delete 방식을 사용하였다.

### 책

- 한 사용자는 여러 책을 대여할 수 있다.
- 책은 하나의 카테고리에 속한다.
- 책은 제목과 설명 정보를 가진다.
- 하나의 책에는 여러 해시태그가 붙을 수 있다.
- 하나의 해시태그 역시 여러 책에 사용될 수 있다.
- 사용자는 책에 좋아요를 누를 수 있다.
- 카테고리별 책 개수를 조회할 수 있어야 한다.

### 알림

알림은 다음과 같이 구분할 수 있다.

- 공지 알림
- 책 반납 시간 임박 알림
- 마케팅 알림

---

## 4. 테이블 구성

| 테이블 | 역할 |
| --- | --- |
| `member` | 회원 및 카카오 로그인 정보 저장 |
| `category` | 도서 카테고리 정보 저장 |
| `book` | 도서 정보 저장 |
| `rental` | 회원의 도서 대여 내역 저장 |
| `hashtag` | 해시태그 정보 저장 |
| `book_hashtag` | 도서와 해시태그의 N:M 관계 처리 |
| `book_like` | 회원과 도서 좋아요의 N:M 관계 처리 |
| `notification` | 회원별 알림 정보 저장 |

---

## 5. 테이블 관계

### category - book

하나의 카테고리에는 여러 책이 존재할 수 있다.

`category 1 : N book`

### member - rental - book

한 회원은 여러 책을 대여할 수 있고, 하나의 책 역시 시간에 따라 여러 회원에게 대여될 수 있다.

대여 시점과 반납 예정 시간 등을 저장하기 위해 `rental` 테이블을 별도로 구성하였다.

`member 1 : N rental`

`book 1 : N rental`

### book - book_hashtag - hashtag

책과 해시태그는 N:M 관계이다.

이를 직접 연결하지 않고 `book_hashtag` 매핑 테이블을 사용하였다.

`book 1 : N book_hashtag`

`hashtag 1 : N book_hashtag`

### member - book_like - book

회원과 책의 좋아요 관계 역시 N:M 관계이므로 `book_like` 테이블을 사용하였다.

같은 회원이 같은 책에 여러 번 좋아요를 생성하지 못하도록 UNIQUE 제약조건을 적용하였다.

### member - notification

한 회원은 여러 개의 알림을 받을 수 있다.

`member 1 : N notification`

---

## 6. DDL

```sql
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    kakao_id VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT uq_member_kakao UNIQUE (kakao_id)
);


CREATE TABLE category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT fk_book_category
        FOREIGN KEY (category_id)
        REFERENCES category(id)
);


CREATE TABLE rental (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rented_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at DATETIME NOT NULL,
    returned_at DATETIME NULL,

    CONSTRAINT fk_rental_member
        FOREIGN KEY (member_id)
        REFERENCES member(id),

    CONSTRAINT fk_rental_book
        FOREIGN KEY (book_id)
        REFERENCES book(id)
);


CREATE TABLE hashtag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,

    CONSTRAINT uq_hashtag_name UNIQUE (name)
);


CREATE TABLE book_hashtag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    hashtag_id BIGINT NOT NULL,

    CONSTRAINT fk_book_hashtag_book
        FOREIGN KEY (book_id)
        REFERENCES book(id),

    CONSTRAINT fk_book_hashtag_hashtag
        FOREIGN KEY (hashtag_id)
        REFERENCES hashtag(id),

    CONSTRAINT uq_book_hashtag
        UNIQUE (book_id, hashtag_id)
);


CREATE TABLE book_like (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_like_member
        FOREIGN KEY (member_id)
        REFERENCES member(id),

    CONSTRAINT fk_book_like_book
        FOREIGN KEY (book_id)
        REFERENCES book(id),

    CONSTRAINT uq_book_like
        UNIQUE (member_id, book_id)
);


CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_member
        FOREIGN KEY (member_id)
        REFERENCES member(id)
);
```

---

## 7. 설계 포인트

### 1. 회원 탈퇴는 Soft Delete 적용

회원 탈퇴 시 데이터를 바로 삭제하지 않고 `deleted_at`에 탈퇴 시간을 저장하도록 설계하였다.

이를 통해 기존 대여 내역이나 좋아요 등의 데이터와 회원 간 관계를 유지할 수 있다.

### 2. N:M 관계는 매핑 테이블로 분리

책과 해시태그, 회원과 책 좋아요처럼 양쪽 모두 여러 데이터를 가질 수 있는 경우 별도의 매핑 테이블을 사용하였다.

예를 들어 책과 해시태그의 경우 다음과 같이 구성하였다.

`book -> book_hashtag <- hashtag`

### 3. 중복 좋아요 및 해시태그 방지

다음 UNIQUE 제약조건을 사용하였다.

```sql
UNIQUE (book_id, hashtag_id)
```

같은 책에 동일한 해시태그가 중복 등록되는 것을 방지한다.

```sql
UNIQUE (member_id, book_id)
```

같은 회원이 동일한 책에 여러 번 좋아요를 생성하는 것을 방지한다.

### 4. 카테고리별 책 개수는 별도 저장하지 않음

카테고리별 책 개수는 `book` 데이터를 이용하여 계산할 수 있으므로 별도의 `book_count` 컬럼을 생성하지 않았다.

예시는 다음과 같다.

```sql
SELECT
    category_id,
    COUNT(*) AS book_count
FROM book
WHERE deleted_at IS NULL
GROUP BY category_id;
```

데이터를 중복 저장하지 않아 실제 책 데이터와 집계 값이 달라지는 문제를 방지할 수 있다.

### 5. 반납 예정 시간 저장

반납 시간 임박 알림을 구현하기 위해 `rental` 테이블에 `due_at`을 저장하도록 설계하였다.

`returned_at`이 NULL이라면 아직 반납되지 않은 대여로 판단할 수 있다.

---

## 8. 회고

이번 실습을 통해 화면의 요구사항을 단순히 컬럼으로 옮기는 것이 아니라, 데이터 간 관계를 먼저 파악하는 것이 중요하다는 점을 알게 되었다.

특히 N:M 관계를 그대로 표현하는 것이 아니라 매핑 테이블을 사용해야 한다는 점과, 회원 탈퇴처럼 데이터 삭제 이후에도 기존 데이터와의 관계가 필요한 경우 Soft Delete를 사용할 수 있다는 점을 이해하였다.

또한 카테고리별 책 개수처럼 기존 데이터를 통해 계산할 수 있는 값은 별도의 컬럼으로 저장하지 않고 조회 시 집계하여 데이터 중복을 줄이는 것이 좋다는 점을 배웠다.