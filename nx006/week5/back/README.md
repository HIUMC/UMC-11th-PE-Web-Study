# UMC Week 5 · Movie Backend

NestJS 12 / TypeORM / MySQL 8.4. 회원 닉네임·이메일 중복 확인, 회원별 평점 조회를 구현한다. Node 24, npm, Docker Compose v2를 사용한다.

## Docker 실행

현재 프로젝트는 `.env`가 이미 준비되어 있으므로 그대로 실행한다.

```bash
docker compose up -d --build
docker compose ps
```

- API: `http://localhost:3000`, **컨테이너 이름 `umc-movie`**.
- MySQL: `.env`의 DB_PORT, DB_USER/DB_PASSWORD, DB_NAME 사용. 현재 값은 사용자가 지정한 학습용 root 계정이다. 비밀번호는 `.env`에만 저장한다.
- 실제 프론트: `http://localhost:5174/member-api` (별도 `../week2/umcine`에서 이미 실행 중).
- CORS 실습: `http://localhost:5176`, 미허용 origin 비교: `http://localhost:5175`.
- 5173은 기존 프로세스가 점유하여 간이 화면의 **호스트 포트만 5176**으로 변경했다. 컨테이너 내부에서는 5173이다.

새 환경에서는 `.env.example`을 `.env`로 복사하고 placeholder를 채운다. Compose의 MySQL 초기화는 이번 과제의 `DB_USER=root`에 맞춰져 있다. 비-root 사용자는 별도 계정/권한 준비가 필요하다. 실제 비밀번호는 소스·문서·Postman 환경 파일에 쓰지 않는다.

Compose는 로컬 `.env`의 `DB_HOST=localhost`를 API와 SQL 작업 컨테이너에서 `db`로 바꾼다. MySQL과 API 모두 동일한 DB_PORT를 사용하며 DB 이름·사용자·비밀번호는 `.env`에서 읽는다. `PORT`를 바꾸면 API 공개 포트도 바뀐다. DB와 API의 공개 포트는 호스트 loopback에만 바인딩된다.

`db` healthcheck → `db-prepare` SQL 실행 성공 → `api` 순서로 시작한다. MySQL 데이터는 전용 volume `umc-movie_movie-mysql`에 유지된다. schema/seed 재실행은 기존 데이터를 삭제하거나 덮어쓰지 않는다. 기존 스키마를 자동 변경하지 않으므로 연결 대상이 기존 DB라면 먼저 구조를 확인한다.

```bash
# 비파괴적 SQL 재실행 / 구조 확인
docker compose run --rm db-prepare
docker compose exec -T api node scripts/database.mjs verify
# 로그 확인
docker compose logs --tail=50 api db-prepare
# 컨테이너 중지·제거, 데이터 volume 유지
docker compose down
```

`down -v` 또는 DB 삭제 명령은 기본 실행 절차에 포함하지 않는다. 기존 volume에서는 MySQL 초기 비밀번호/DB 이름 환경 변수를 바꿔도 계정/DB가 자동 갱신되지 않는다.

## API

| Method / path | 성공 응답 |
|---|---|
| GET /members/nickname/{nickname} | `{"available": boolean}` |
| GET /members/email/{email} | `{"available": boolean}` |
| GET /members/{memberId}/ratings | 평점 DTO 배열, ratingId DESC |

선택 미션도 적용되어 닉네임 2~12자·이메일 형식 오류는 400, 평점은 `?page=0&size=10`으로 페이지네이션할 수 있다. query를 생략하면 전체 배열이다. 상세 오류/숫자/날짜/정규화 계약은 [API 명세](docs/api-spec.md)를 따른다.

## Docker DB + 로컬 Nest 실행

Docker API와 같은 포트를 동시에 사용하지 않는다.

```bash
npm ci
docker compose up -d db
npm run db:prepare
npm run start:dev
```

Docker API가 실행 중이면 먼저 `docker compose stop api`를 실행한다. 외부 MySQL을 사용할 때는 `.env`의 DB_HOST/DB_PORT를 실제 접속값으로 설정하고 DB를 사전에 생성한다. DATETIME 계약을 위해 DB의 기본/session time_zone을 UTC로 맞춘다. Nest는 `synchronize:false`이며 DB 준비는 반드시 SQL로 수행한다.

## 검증

```bash
npm run build
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:integration -- --optional
# 빌드가 최신이면 통합 스크립트만 실행 가능
node scripts/integration.mjs --optional
# 동일 통합 검증을 Docker 내부에서 실행
docker compose exec -T api node scripts/integration.mjs --optional
```

`test:e2e`는 mock repository 기반 HTTP 테스트다. `test:integration`은 실제 MySQL에 무작위 이름의 **임시 테스트 DB**를 생성하고 실제 Nest HTTP 요청·DB 제약을 검증한 뒤 자신이 만든 DB만 삭제한다. 테스트 계정에 CREATE/DROP DATABASE 권한이 필요하다. 응용 DB의 회원·평점을 지우지 않는다.

## CORS 실습

기본 최종 모드는 `restricted`, 허용 목록은 localhost의 5173·5174·5176이다. 5175는 비교를 위해 허용하지 않는다. 실습 화면은 실제 브라우저 fetch를 쓰고 `cache:'no-store'`로 과거 `*` 응답 재사용을 막는다.

```bash
# 5176 실습 화면: 실패 (서버 GET 200이지만 브라우저 응답 읽기 차단)
CORS_MODE=off docker compose up -d --no-deps api
# 5176과 실제 프론트 5174: 성공, 5175: 실패
docker compose up -d --no-deps api
# 5175도 성공하는 선택 비교
CORS_MODE=all docker compose up -d --no-deps api
# 실습 후 반드시 최종 제한 설정 복구
docker compose up -d --no-deps api
```

각 재생성 후 `docker compose ps`에서 API가 healthy인지 확인하고 요청한다. `.env`에 CORS_MODE를 명시했다면 복구 시 `CORS_MODE=restricted`를 명시한다. production에서는 off/all을 거부한다. OPTIONS preflight와 simple GET 차이는 [미션 기록](docs/week5-mission.md)에 설명했다. 프록시/no-cors/쿠키 인증은 사용하지 않는다.

## 실제 프론트와 Postman

실제 프론트에 `/member-api`와 메뉴를 추가했고 세 API를 직접 호출한다. 필요하면 프론트 `VITE_MOVIE_API_BASE_URL`을 설정한 뒤 Vite를 재시작한다. 코드 변경을 재현할 [프론트 패치](frontend-integration/umcine-week5.patch)와 [적용 안내](frontend-integration/README.md)를 제공한다.

Postman의 Import에서 `postman/week5-movie.postman_collection.json`, `postman/local.postman_environment.json`을 선택하고 Movie local 환경에서 실행한다. collection에는 성공·400·404·페이지네이션 검사 15개가 들어 있다. 새 seed DB의 회원 1을 기준으로 한다. Postman 앱은 실행하지 않았다. 사용자 요청에 따른 [Notion 기록](https://app.notion.com/p/cbfcd44c590482ba8bda01a45b5406e7)에는 실제 Chrome 캡처 8장과 코드·검증 로그를 첨부했다.

## 기록

- [핵심 설계](docs/architecture.md)
- [전체 ERD](docs/erd.md)
- [진행·재개 상태](docs/progress.md)
- [과정·코드·검증 증거](docs/week5-mission.md)

Git push·배포·외부 제출은 수행하지 않았다.
