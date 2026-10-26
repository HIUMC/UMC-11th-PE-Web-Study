# 03. API 명세

Base URL: `http://localhost:8080`. 인증 없음. 모든 요청은 GET이며 Body가 없다.
예시는 기본 시드 기준이다. 실제 ID/시각은 DB 상태에 따라 달라진다.

| API | Method | Path | Request | 200 응답 |
|---|---|---|---|---|
| 닉네임 중복 체크 | GET | /members/nickname/{nickname} | Path nickname: string | available: boolean |
| 이메일 중복 체크 | GET | /members/email/{email} | Path email: string | available: boolean |
| 회원별 평점 조회 | GET | /members/{memberId}/ratings | Path memberId: Long | RatingResponse 배열 |

## 닉네임/이메일

중복이면 사용 불가능하므로 `false`, 중복이 없으면 `true`다.

```http
GET /members/nickname/수현
GET /members/email/noco@umc.com
```

```json
{"available": false}
```

새 값에 대한 예시:

```http
GET /members/nickname/새로운닉네임
GET /members/email/new@umc.com
```

```json
{"available": true}
```

브라우저는 `encodeURIComponent`로 Path 값을 인코딩한다. 선택 과제인 서버 닉네임 길이/이메일 형식 검증은 구현하지 않았다. 따라서 malformed 문자열도 경로로 수신되면 중복 여부만 판단한다.

## 회원별 평점

```http
GET /members/1/ratings
```

아래는 응답 형태 예시이며 실제 실행 결과를 복사한 것이 아니다.

```json
[
  {
    "ratingId": 2,
    "movieId": 155,
    "score": 4,
    "comment": "다시 봐도 명작",
    "createdAt": "2026-10-26T01:00:00",
    "updatedAt": "2026-10-26T01:00:00"
  },
  {
    "ratingId": 1,
    "movieId": 550,
    "score": 5,
    "comment": "최고의 영화!",
    "createdAt": "2026-10-26T01:00:00",
    "updatedAt": "2026-10-26T01:00:00"
  }
]
```

| 필드 | JSON 타입 | 의미 |
|---|---|---|
| ratingId | number | 평점 ID |
| movieId | number | TMDB 영화 ID |
| score | number | 별점, 시드 값 1~5 |
| comment | string 또는 null | 코멘트 |
| createdAt | string | ISO-8601 로컬 날짜/시각, 시간대 오프셋 없음 |
| updatedAt | string | ISO-8601 로컬 날짜/시각, 시간대 오프셋 없음 |

정렬은 ratingId DESC다. 이번 데이터에서는 나중에 등록된 평점이 먼저 나온다. 수정 시각 기준 정렬은 아니다.

| 상황 | HTTP 상태 | 응답 |
|---|---|---|
| 회원 존재 + 평점 있음 | 200 | 자신의 평점 배열 |
| 회원 존재 + 평점 없음 | 200 | [] |
| 회원 없음 | 404 | Spring 기본 오류 응답 |
| memberId가 abc 등 숫자로 변환 불가 | 400 | Spring 기본 오류 응답 |
| 허용하지 않은 Origin의 브라우저 요청 | 403 | CORS 처리에서 거부, JS는 응답을 읽지 못함 |

404/400의 JSON 필드는 이번 주에 별도 표준화하지 않았다. 기본 설정에서는 서비스의 예외 메시지가 응답 Body에 포함되지 않을 수 있다. 프론트는 상태 코드로 사용자 안내를 표시한다.

## CORS

허용 Origin 기본값은 `http://localhost:5173`, 경로는 `/members/**`, 메서드는 GET/POST/PATCH/DELETE다. POST/PATCH/DELETE API 자체가 구현됐다는 뜻은 아니다.
`CORS_ENABLED=false`는 설정 전 실험용이다. 기본값은 true다.
다른 화면과 연결할 때는 실제 출처를 `CORS_ALLOWED_ORIGINS`에 쉼표로 나열한다. localhost/127.0.0.1, 포트, http/https 차이를 구분한다. 쿠키 인증은 사용하지 않으며 allowCredentials도 켜지 않는다.
