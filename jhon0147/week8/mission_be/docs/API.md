# 8주차 API 명세

아래 응답은 명세 예시이며 실요청 결과가 아니다. 이전 주차의 회원가입·로그인·내 정보·평점 기능을 유지한다.

## 인증과 공통 응답

8주차 API 다섯 개는 모두 `Authorization: Bearer {accessToken}`이 필요하다. `@LoginMember`는 인터셉터가 검증한 토큰의 회원 번호를 전달한다. 회원 ID를 요청 바디나 쿼리로 받지 않는다.

회원가입은 `POST /members`에 email, nickname, password를 보내고 201을 받는다. 로그인은 `POST /auth/login`에 email, password를 보내며 200 응답의 `result.accessToken`을 사용한다.

성공 응답은 `isSuccess, code, message, result`, 실패 응답은 `isSuccess: false`와 오류 코드·메시지, `result: null`을 가진다.

| 기능 | Method / URL | 요청 | 성공 | 주요 실패 |
| --- | --- | --- | --- | --- |
| 즐겨찾기 등록 | POST /favorites | movieId | 201 / COMMON201 | 400, 401, 404 MEMBER404_1, 409 FAVORITE409_1 |
| 내 목록 | GET /favorites | 토큰 | 200 / COMMON200, 배열 | 401 |
| 여부 조회 | GET /favorites/{movieId} | 토큰, 양의 영화 ID | 200 / COMMON200, isFavorite | 400, 401 |
| 해제 | DELETE /favorites/{movieId} | 토큰, 양의 영화 ID | 200 / COMMON200, null | 400, 401, 404 FAVORITE404_1 |
| 영화 기록 저장 | POST /movie-records | movieId, score, comment(선택), addToFavorites | 201 / COMMON201 | 400, 401, 404 MEMBER404_1, 409 RATING409_1 또는 FAVORITE409_1 |

## 1. 즐겨찾기 등록

~~~http
POST /favorites
Authorization: Bearer {accessToken}
Content-Type: application/json
~~~

~~~json
{"movieId":550}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "즐겨찾기를 등록했습니다.",
  "result": {"favoriteId":1,"movieId":550,"createdAt":"2026-11-15T22:00:00"}
}
~~~

movieId는 필수 양의 정수다. 동일 회원·영화는 409 / FAVORITE409_1이며, 다른 회원은 같은 영화를 등록할 수 있다. 실제 TMDB 영화 존재 여부를 외부 API로 확인하지는 않는다.

## 2. 내 즐겨찾기 목록

~~~http
GET /favorites
Authorization: Bearer {accessToken}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "내 즐겨찾기 목록을 조회했습니다.",
  "result": [
    {"favoriteId":2,"movieId":238,"createdAt":"2026-11-15T22:01:00"},
    {"favoriteId":1,"movieId":550,"createdAt":"2026-11-15T22:00:00"}
  ]
}
~~~

favoriteId 내림차순이다. 데이터가 없으면 200과 빈 배열을 반환한다.

## 3. 즐겨찾기 여부

~~~http
GET /favorites/550
Authorization: Bearer {accessToken}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "즐겨찾기 여부를 조회했습니다.",
  "result": {"isFavorite":true}
}
~~~

미등록 상태는 200 / isFavorite: false다. path는 favoriteId가 아닌 movieId다. 0·음수·숫자가 아닌 ID는 400이다.

## 4. 즐겨찾기 해제

~~~http
DELETE /favorites/550
Authorization: Bearer {accessToken}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "즐겨찾기를 해제했습니다.",
  "result": null
}
~~~

회원 ID와 movieId가 모두 일치하는 행만 삭제한다. 다른 회원에게만 있거나 이미 삭제된 경우 404 / FAVORITE404_1이다.

## 5. 영화 기록 저장

~~~http
POST /movie-records
Authorization: Bearer {accessToken}
Content-Type: application/json
~~~

~~~json
{
  "movieId":680,
  "score":5,
  "comment":"다시 보고 싶은 영화",
  "addToFavorites":true
}
~~~

~~~json
{
  "isSuccess": true,
  "code": "COMMON201",
  "message": "영화 기록을 저장했습니다.",
  "result": {
    "rating":{"ratingId":1,"movieId":680,"score":5,"comment":"다시 보고 싶은 영화","createdAt":"2026-11-15T22:02:00","updatedAt":"2026-11-15T22:02:00"},
    "favorite":{"favoriteId":3,"movieId":680,"createdAt":"2026-11-15T22:02:00"}
  }
}
~~~

| 필드 | 규칙 |
| --- | --- |
| movieId | 필수, 양의 정수 |
| score | 필수, 정수 1~5 |
| comment | 선택, 최대 500자 |
| addToFavorites | 필수 Boolean, 누락·null은 400 |

true이면 두 저장이 하나의 트랜잭션 안에서 실행된다. 기존 평점은 409 / RATING409_1, 추가하려는 즐겨찾기가 이미 있으면 409 / FAVORITE409_1이다. false이면 평점만 저장하고 `favorite: null`을 반환한다. 기존 즐겨찾기가 있어도 false이면 허용하며 해당 행을 유지한다.

## 오류 코드

| HTTP | code | 상황 |
| --- | --- | --- |
| 400 | COMMON4001 | 필수값·양수·별점 범위·후기 길이·JSON 형식 오류 |
| 401 | AUTH401_2 | 토큰 없음 또는 Bearer 헤더 없음 |
| 401 | AUTH401_3 | 서명·형식 등이 잘못된 토큰 |
| 401 | AUTH401_4 | 만료된 토큰 |
| 404 | MEMBER404_1 | 저장 요청의 회원이 DB에 없음 |
| 404 | FAVORITE404_1 | 해제할 내 즐겨찾기가 없음 |
| 409 | FAVORITE409_1 | 같은 회원·영화의 즐겨찾기 중복 |
| 409 | RATING409_1 | 영화 기록 저장 시 평점 중복 |

인증 검사는 입력값 검증보다 먼저 수행하므로 토큰이 없는 잘못된 요청은 401을 받을 수 있다. DB의 `uk_favorite_member_movie` 제약 위반도 사전 검사와 같은 FAVORITE409_1로 처리한다.

## 검증 안내

예시 ID·시각은 고정된 실제 결과가 아니다. 실행 절차는 README, 캡처는 CAPTURES.md를 참고한다. JUnit과 Postman 실요청은 현재 환경의 다운로드 제한으로 미확인이다.
