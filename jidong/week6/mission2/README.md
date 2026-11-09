# 6주차 - 입력한 데이터를 저장하기 (Spring Boot)

영화 평점 서비스에 회원가입과 평점 등록·수정·삭제 API를 추가했습니다.
5주차 조회 API(닉네임·이메일 중복 체크, 유저별 평점 조회)는 그대로 유지합니다.

## 공통 응답 형식

성공과 실패 모두 같은 구조로 응답합니다. (DELETE 성공은 204로 본문 없음)

성공 예시

```json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "회원가입에 성공했습니다.",
  "result": {
    "memberId": 3,
    "email": "test3578@umc.com",
    "nickname": "fan3578"
  }
}
```

실패 예시

```json
{
  "isSuccess": false,
  "code": "COMMON4092",
  "message": "이미 사용 중인 이메일입니다.",
  "result": null
}
```

| code | HTTP | 상황 |
|---|---|---|
| COMMON200 / COMMON201 | 200 / 201 | 성공 |
| COMMON4001 | 400 | DTO 검증 실패 (이메일 형식, 비밀번호 규칙, 별점 범위, 후기 길이 등) |
| COMMON4002 / COMMON4003 | 400 | 요청 본문 형식 오류 / 경로 값 타입 오류 |
| COMMON403 | 403 | 다른 회원의 평점 수정·삭제 |
| COMMON404 | 404 | 존재하지 않는 회원·평점 |
| COMMON4092 | 409 | 서비스에서 확인한 중복 (이메일, 닉네임, 같은 영화 평점) |
| COMMON4091 | 409 | DB UNIQUE 제약 위반 (동시 요청 등) |

## API 명세

| 기능 | Method | URL | Request | Success |
|---|---|---|---|---|
| 회원가입 | POST | /members | Body: email, password, nickname | 201, result: { memberId, email, nickname } |
| 평점 등록 | POST | /members/{memberId}/ratings | Path: memberId / Body: movieId, score, comment | 201, result: ratingId |
| 평점 수정 | PATCH | /members/{memberId}/ratings/{ratingId} | Path: memberId, ratingId / Body: score, comment | 200, result: null |
| 평점 삭제 | DELETE | /members/{memberId}/ratings/{ratingId} | Path: memberId, ratingId | 204 No Content |
| 닉네임 중복 체크 (5주차) | GET | /members/nickname/{nickname} | Path: nickname | 200, { available } |
| 이메일 중복 체크 (5주차) | GET | /members/email/{email} | Path: email | 200, { available } |
| 유저별 평점 조회 (5주차) | GET | /members/{memberId}/ratings | Path: memberId | 200, 평점 배열 (최신순) |

### 입력 검증 규칙

- **email**: 필수, 이메일 형식
- **password**: 필수, 영문 대문자·소문자·숫자·특수문자(!@#$%^&*) 포함 8자 이상, bcrypt 해시로 저장하고 응답에는 포함하지 않음
- **nickname**: 필수, 2자 이상 12자 이하
- **movieId**: 필수, 양수 (TMDB 영화 ID)
- **score**: 필수, 1 이상 5 이하
- **comment**: 선택, 500자 이하

### 요청 예시

```http
POST /members
Content-Type: application/json

{ "email": "umc@example.com", "password": "Umc!1234", "nickname": "moviefan" }
```

```http
POST /members/1/ratings
Content-Type: application/json

{ "movieId": 27205, "score": 5, "comment": "꿈속의 꿈" }
```

```http
PATCH /members/1/ratings/4
Content-Type: application/json

{ "score": 3, "comment": "다시 보니 3점" }
```

## 저장 실패를 막는 세 단계

1. **DTO 검증** (`@Valid`): 형식과 범위가 틀리면 400
2. **서비스 검증**: 존재 여부(404), 소유자(403), 중복(409)
3. **DB 제약**: member.email·nickname UNIQUE, rating(member_id, movie_id) 복합 UNIQUE → 동시 요청도 409

## 점검 스크립트

서버 실행 후 아래 명령으로 체크리스트 케이스(201/200/204/400/403/404/409, password 미노출, 삭제 반영)를 한 번에 확인할 수 있습니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\http-test\api-test.ps1
```
