# UMCine 7주차

6주차 영화 프로젝트에 회원가입과 회원 화면을 추가했습니다.

- `/signup`: 입력값 검사, 이메일·닉네임 중복 확인, 회원가입 요청
- `/login`: 로그인 폼과 입력값 확인
- `/mypage`: 예시 회원 정보와 북마크한 영화
- `/edit-profile`: 닉네임 수정 후 조회 화면에 반영

로그인과 회원 정보의 API 연동은 다음 주차 범위입니다. 내 정보의 닉네임은 화면 확인용 상태이며 새로고침하면 초기화됩니다.

## 실행

Node.js 22.12 이상과 pnpm을 사용합니다.

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local`의 `VITE_API_BASE_URL`은 회원 서버 주소입니다. 기본값은 `http://localhost:8080`입니다. 영화 화면에는 기존 TMDB 토큰을 설정합니다.

회원가입에는 6주차 백엔드를 실행해야 합니다. 백엔드 CORS 설정의 허용 주소와 브라우저 주소를 맞춰 주세요. 기본 개발 서버 주소는 `http://localhost:5173`입니다.

## 확인

```powershell
pnpm lint
pnpm test
pnpm build
```

회원 요청에는 TMDB용 인증 헤더를 붙이지 않습니다. 중복 확인 결과는 `available`과 기존 백엔드의 `result.available`을 처리합니다. 가입 요청에는 `email`, `nickname`, `password`만 보냅니다.

`routes/(member)`는 회원 페이지를 모은 폴더입니다. URL에는 폴더 이름이 포함되지 않습니다.
