# 6주차 API 명세

기본 주소: `http://localhost:8080`

JSON 요청에는 `Content-Type: application/json`을 사용한다. 삭제 성공을 제외한 응답은 `isSuccess`, `code`, `message`, `result`로 구성한다. 5주차 조회 API도 같은 형식으로 맞췄으므로 중복 확인 값과 평점 목록은 `result`에서 읽는다.

| 기능 | Method | 경로 | 성공 상태 | result |
| --- | --- | --- | --- | --- |
| 회원가입 | POST | /members | 201 | 회원 번호, 이메일, 닉네임 |
| 닉네임 중복 확인 | GET | /members/nickname/{nickname} | 200 | available |
| 이메일 중복 확인 | GET | /members/email/{email} | 200 | available |
| 회원별 평점 조회 | GET | /members/{memberId}/ratings | 200 | 평점 목록 |
| 평점 등록 | POST | /members/{memberId}/ratings | 201 | 생성된 평점 번호 |
| 평점 수정 | PATCH | /members/{memberId}/ratings/{ratingId} | 200 | null |
| 평점 삭제 | DELETE | /members/{memberId}/ratings/{ratingId} | 204 | 응답 본문 없음 |

## 회원가입

```http
POST /members
Content-Type: application/json

{
  "email": "moviefan@umc.com",
  "password": "Umc!1234",
  "nickname": "영화친구"
}
```

| 필드 | 규칙 |
| --- | --- |
| email | 필수, 이메일 형식, 254자 이하 |
| password | 필수, 8자 이상, 영문 대문자·소문자·숫자와 `!@#$%^&*` 중 하나 이상 포함, UTF-8 기준 72바이트 이하 |
| nickname | 필수, 공백만 입력 불가, 2~12자 |

예시 비밀번호는 실습용 값이다. 실제 비밀번호는 환경 설정이나 응답에 기록하지 않는다.

```json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "회원가입에 성공했습니다.",
  "result": {
    "memberId": 4,
    "email": "moviefan@umc.com",
    "nickname": "영화친구"
  }
}
```

`password`와 bcrypt 해시는 응답에서 제외한다.

## 평점 등록

```http
POST /members/4/ratings
Content-Type: application/json

{
  "movieId": 550,
  "score": 5,
  "comment": "다시 보고 싶은 영화"
}
```

- movieId: 필수, 양의 정수. TMDB의 영화 번호를 저장한다.
- score: 필수, 1~5의 정수. `3.5` 같은 소수는 400으로 거부한다.
- comment: 선택, 500자 이하. 생략하거나 null을 보내도 된다.
- 같은 회원과 영화의 조합은 한 번만 등록할 수 있다.

```json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "평점 등록에 성공했습니다.",
  "result": 4
}
```

## 평점 수정

```http
PATCH /members/4/ratings/4
Content-Type: application/json

{
  "score": 4,
  "comment": "두 번째 감상 후 수정한 후기"
}
```

별점은 필수다. 후기를 생략하거나 null로 보내면 기존 후기를 지운다. 영화 번호와 작성자는 변경하지 않는다. 경로의 회원 번호와 평점 작성자가 다르면 403, 평점 자체가 없으면 404를 반환한다.

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "평점 수정에 성공했습니다.",
  "result": null
}
```

## 평점 삭제

```http
DELETE /members/4/ratings/4
```

성공하면 `204 No Content`이며 JSON 본문이 없다. 이미 삭제된 번호로 다시 수정하거나 삭제하면 404다.

## 오류 응답

| 상태 | code | 의미 |
| --- | --- | --- |
| 400 | COMMON4001 | 입력 규칙 위반, 잘못된 JSON 또는 번호 형식 |
| 403 | RATING4031 | 작성자가 다른 평점을 수정·삭제하려는 요청 |
| 404 | MEMBER4041 | 평점을 등록·조회할 회원이 없음 |
| 404 | RATING4041 | 수정·삭제할 평점이 없음 |
| 409 | MEMBER4091 | 이메일 중복 |
| 409 | MEMBER4092 | 닉네임 중복 |
| 409 | RATING4091 | 같은 회원·영화의 평점 중복 |
| 409 | COMMON4091 | 그 외 DB 무결성 제약 위반 |

```json
{
  "isSuccess": false,
  "code": "MEMBER4091",
  "message": "이미 사용 중인 이메일입니다.",
  "result": null
}
```

DB 제약 위반에서도 지정한 UNIQUE 제약 이름을 확인해 이메일·닉네임·평점 중복을 구분한다. DB의 SQL이나 내부 예외 메시지는 응답에 넣지 않는다. 여러 입력 규칙을 동시에 어겼다면 그중 한 오류 메시지를 반환한다.
