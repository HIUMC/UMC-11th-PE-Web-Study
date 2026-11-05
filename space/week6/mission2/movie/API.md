# Movie API 명세서

Base URL: `http://localhost:8080`  
Content-Type: `application/json`

## 공통 응답 형식

성공/실패 시 대부분 아래 형식을 사용합니다.

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "메시지",
  "result": {}
}
```

| 코드 | 의미 |
|------|------|
| `COMMON200` | 성공 |
| `COMMON201` | 생성 성공 |
| `COMMON4001` | 요청 유효성 검증 실패 |
| `COMMON4091` | 데이터 중복 (DB 제약) |
| `COMMON4092` | 비즈니스 충돌 (이메일/닉네임/평점 중복 등) |
| `COMMON404` | 리소스 없음 |
| `COMMON403` | 권한 없음 |

---

## 1. 회원

### 1.1 회원가입

`POST /members`

**Request**

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| email | string | O | 이메일 형식 |
| password | string | O | 대/소문자, 숫자, 특수문자(`!@#$%^&*`) 포함 8자 이상 |
| nickname | string | O | 2~12자 |

```json
{
  "email": "user@example.com",
  "password": "Password1!",
  "nickname": "우주"
}
```

**Response** `201 Created`

```json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "회원가입에 성공했습니다.",
  "result": {
    "memberId": 1,
    "email": "user@example.com",
    "nickname": "우주"
  }
}
```

**Error**

| HTTP | code | 상황 |
|------|------|------|
| 400 | COMMON4001 | 유효성 검증 실패 |
| 409 | COMMON4092 | 이메일 또는 닉네임 중복 |

---

## 2. 평점

### 2.1 회원 평점 목록 조회

`GET /members/{memberId}/ratings`

**Path**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| memberId | long | 회원 ID |

**Response** `200 OK` (배열 직접 반환)

```json
[
  {
    "ratingId": 1,
    "movieId": 100,
    "score": 5,
    "comment": "재미있어요",
    "createdAt": "2026-11-05T12:00:00",
    "updatedAt": "2026-11-05T12:00:00"
  }
]
```

**Error**

| HTTP | code | 상황 |
|------|------|------|
| 404 | COMMON404 | 존재하지 않는 회원 |

---

### 2.2 평점 등록

`POST /members/{memberId}/ratings`

**Path**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| memberId | long | 회원 ID |

**Request**

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| movieId | long | O | 양수 |
| score | int | O | 1~5 |
| comment | string | X | 최대 500자 |

```json
{
  "movieId": 100,
  "score": 5,
  "comment": "재미있어요"
}
```

**Response** `201 Created`

```json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "평점 등록에 성공했습니다.",
  "result": 1
}
```

> `result`는 생성된 `ratingId`입니다.

**Error**

| HTTP | code | 상황 |
|------|------|------|
| 400 | COMMON4001 | 유효성 검증 실패 |
| 404 | COMMON404 | 존재하지 않는 회원 |
| 409 | COMMON4092 | 동일 영화에 이미 평점 존재 |

---

### 2.3 평점 수정

`PATCH /members/{memberId}/ratings/{ratingId}`

**Path**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| memberId | long | 회원 ID |
| ratingId | long | 평점 ID |

**Request**

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| score | int | O | 1~5 |
| comment | string | X | 최대 500자 |

```json
{
  "score": 4,
  "comment": "다시 보니 괜찮아요"
}
```

**Response** `200 OK`

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "평점 수정에 성공했습니다.",
  "result": null
}
```

**Error**

| HTTP | code | 상황 |
|------|------|------|
| 400 | COMMON4001 | 유효성 검증 실패 |
| 403 | COMMON403 | 본인 평점이 아님 |
| 404 | COMMON404 | 존재하지 않는 평점 |

---

### 2.4 평점 삭제

`DELETE /members/{memberId}/ratings/{ratingId}`

**Path**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| memberId | long | 회원 ID |
| ratingId | long | 평점 ID |

**Response** `204 No Content` (본문 없음)

**Error**

| HTTP | code | 상황 |
|------|------|------|
| 403 | COMMON403 | 본인 평점이 아님 |
| 404 | COMMON404 | 존재하지 않는 평점 |
