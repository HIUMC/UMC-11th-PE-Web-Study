# 9주차 API 안내

실행 중인 서버의 `/swagger-ui.html`과 `/v3/api-docs`에서 요청 스키마·응답 예시·인증 여부를 확인한다. 공통 성공 코드는 200이면 `COMMON200`, 201이면 `COMMON201`이다.

| Method | URL | 인증 | 성공 | 주요 실패: HTTP / code |
| --- | --- | --- | --- | --- |
| POST | /members | 공개 | 201 | 400 COMMON4001, 409 MEMBER409_1·MEMBER409_2 |
| POST | /auth/login | 공개 | 200 | 400 COMMON4001, 401 AUTH401_1 |
| GET | /members/nickname/{nickname} | 공개 | 200 | 이미 사용 중이면 available=false |
| GET | /members/email/{email} | 공개 | 200 | 이미 사용 중이면 available=false |
| GET | /members/{memberId}/ratings | 공개 | 200 | 400 COMMON4001, 404 MEMBER404_1 |
| GET | /members/me | 필요 | 200 | 401, 404 MEMBER404_1 |
| PATCH | /members/me | 필요 | 200 | 400 COMMON4001, 401, 404 MEMBER404_1, 409 MEMBER409_1 |
| POST | /ratings | 필요 | 201 | 400 COMMON4001, 401, 404 MEMBER404_1, 409 RATING409_1 |
| PATCH | /ratings/{ratingId} | 필요 | 200 | 400 COMMON4001, 401, 403 RATING403_1, 404 RATING404_1 |
| DELETE | /ratings/{ratingId} | 필요 | 200 | 400 COMMON4001, 401, 403 RATING403_1, 404 RATING404_1 |
| POST | /favorites | 필요 | 201 | 400 COMMON4001, 401, 404 MEMBER404_1, 409 FAVORITE409_1 |
| GET | /favorites | 필요 | 200 | 401 |
| GET | /favorites/{movieId} | 필요 | 200 | 400 COMMON4001, 401 |
| DELETE | /favorites/{movieId} | 필요 | 200 | 400 COMMON4001, 401, 404 FAVORITE404_1 |
| POST | /movie-records | 필요 | 201 | 400 COMMON4001, 401, 404 MEMBER404_1, 409 RATING409_1·FAVORITE409_1 |

인증 API의 공통 401 코드는 토큰 누락 `AUTH401_2`, 유효하지 않은 토큰 `AUTH401_3`, 만료 `AUTH401_4`다. 문서 경로는 공개이지만 보호 API는 JWT 검증을 그대로 거친다.

즐겨찾기 여부 미등록은 `200 / isFavorite:false`다. 회원은 있으나 평점·즐겨찾기 목록이 비어 있으면 `200 / []`다. 평점·즐겨찾기 삭제 성공은 `200 / result:null`이다.

영화 번호는 TMDB ID다. 보호 API의 요청자는 토큰에서 식별한다. `@Parameter(hidden=true)`는 내부 회원 ID의 문서 표시만 숨기며 실제 인증은 인터셉터가 수행한다.
