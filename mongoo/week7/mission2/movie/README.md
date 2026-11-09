# UMC 백엔드 5주차 — 영화 평점 API

Spring Boot 3.5.0 · Java 21 · MySQL · JPA. DB 이름은 직접 만든 `umc_movie_week5`다.
**필수 미션 화면은 기존 `week5/mission1/umcine`이다. 별도의 데모 사이트를 실행하지 않는다.**

## 1. DB 확인

이미 테이블 3개와 회원/평점 데이터를 넣었다면 재생성하지 않는다. 새 DB에서만 `sql/01-schema.sql` → `sql/02-seed.sql` 순서로 실행한다. `sql/03-verify.sql`로 실제 회원 번호를 확인한다.

## 2. 백엔드 실행

IntelliJ Terminal에서 현재 `movie` 폴더를 기준으로 실행한다.

```bash
./scripts/run-backend.sh
```

MySQL 비밀번호를 입력하고 `Started MovieApplication`을 확인한다. 기본 주소는 http://localhost:8080이다.
이미 실행 중이면 다시 실행하지 않는다. 스크립트는 비밀번호를 파일에 저장하지 않는다.

## 3. Postman 검증

`postman/UMC-week5.postman_collection.json`을 Import한다. memberId를 실제 회원 번호로 설정한다. 닉네임/이메일 중복·신규, 회원별 평점 정렬, 없는 회원 404를 확인한다.

## 4. 기존 프론트엔드 실행

**기존 UMCine가 이미 http://localhost:5173 에 떠 있다면 이 단계를 건너뛴다.**
새 터미널에서 기존 프론트 폴더로 이동하고 실행한다.

```bash
cd ../../mission1/umcine
pnpm dev --port 5173 --strictPort
```

또는 movie 폴더에서 `./scripts/run-frontend.sh`를 실행해도 같은 기존 프로젝트가 열린다.
주소: **http://localhost:5173**. Python 데모 서버는 사용하지 않는다. 5173이 사용 중이면 어떤 서버인지 먼저 확인하며 기존 UMCine를 임의로 종료하지 않는다.

## 5. 실제 화면에 API 3개 연결 (필수 미션)

기존 목록에서 영화 상세로 들어간다. 기존 **내 평점** 영역 아래의 **회원 정보 확인 · 평점 불러오기**를 펼친다.

- 닉네임 `수현`으로 중복 확인: `available: false`. 새로운 닉네임은 true.
- 이메일 `noco@umc.com`으로 중복 확인: false. 새로운 이메일은 true.
- 조회할 회원 번호(기본 1)를 입력하고 평점 조회: 해당 회원의 평점 목록을 등록 번호 내림차순으로 표시한다.
- 목록의 영화 번호를 누르면 기존 영화 상세 경로로 이동한다. 현재 영화의 평점/후기가 있으면 기존 별점과 후기 영역에 표시한다.

새 페이지/데모/로그인 화면을 추가하지 않았다. 기존 영화 목록·검색·헤더·TMDB 출처와 영화 API 호출을 유지한다. 평점 저장 API는 6주차 범위이므로 이번에는 저장 버튼을 비활성화했다. 로그인/JWT/회원가입/즐겨찾기 API도 추가하지 않았다.
회원 번호를 명시하는 것은 로그인 구현이 아니라 이번 주 조회 실습을 위한 입력이다. 브라우저 Network를 열어 URL·상태·JSON을 실제 화면과 함께 캡처한다.

## 6. CORS 실습 (간이 HTML)

워크북 실습 0/9절용 간이 HTML은 백엔드와 별개인 `../mock-frontend/index.html`이다. **이 파일은 필수 미션 화면이 아니다.**
간이 HTML 실습을 직접 할 때만 본인이 Vite 터미널에서 Ctrl+C로 잠시 종료해 5173 포트를 비운다.

```bash
# movie 폴더에서 별도 mock-frontend 폴더로 이동
cd ../mock-frontend
npx serve -l 5173
```

백엔드 movie 폴더의 별도 터미널에서 `CORS_ENABLED=false ./scripts/run-backend.sh`로 실행한 상태에서 버튼을 눌러 Console 오류를 확인한다. 이후 백엔드를 종료하고 `./scripts/run-backend.sh`로 다시 시작해 정상 응답을 확인한다.
실습을 마치면 간이 서버를 Ctrl+C로 종료하고 **4번의 기존 UMCine를 다시 실행**한다. 두 서버를 같은 5173 포트에 동시에 띄우지 않는다.

## 문서와 검증

- [01 실습 순서](docs/01-실습순서.md)
- [02 ERD](docs/02-ERD.md)
- [03 API 명세](docs/03-API명세.md)
- [04 코드 설명](docs/04-코드설명.md)
- [05 핵심 키워드](docs/05-핵심키워드.md)
- [06 제출 기록](docs/06-미션제출기록.md)
- [07 검증 결과](docs/07-검증결과.md)

```bash
./gradlew test bootJar
```

자동 테스트의 DB는 H2이며, 일반 실행은 MySQL이다. 자동 테스트가 제출용 Postman/브라우저 인증을 대신하지 않는다.
필수 미션은 실제 UMCine 화면에서 API 3개의 응답을 확인한 뒤 인증 캡처·핵심 코드·회고를 Notion에 기록하고 제출한다.
