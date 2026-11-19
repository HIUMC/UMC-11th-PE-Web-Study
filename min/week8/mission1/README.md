# Week 7 · UMCine

```sh
npm run dev
```

- `/login`: 입력 검증, `POST /auth/login`, 토큰 저장, 로그인 성공 후 내 정보 이동.
- `/signup`: 이메일·닉네임 중복 확인, 비밀번호 검증, 회원가입 요청.
- `/mypage`: `GET /members/me`와 기존 북마크 저장소의 즐겨찾기 조회.
- `/mypage/edit`: 닉네임 중복 확인, `PATCH /members/me`, 최대 5MB JPG/PNG/WEBP 이미지 미리보기와 브라우저 저장.

회원 서버는 `.env.local`의 `VITE_API_BASE_URL`로 설정합니다. 기본값은 `http://localhost:8080`이며, 서버에서 프런트엔드 주소에 대한 CORS 허용이 필요합니다. 환경 변수 수정 후 개발 서버를 재시작하세요.

회원가입은 `GET /members/email/{email}`, `GET /members/nickname/{nickname}`, `POST /members`를 사용합니다. 두 중복 확인의 `available: true`와 모든 입력 조건을 충족해야 가입할 수 있습니다. 비밀번호 확인은 요청에 포함하지 않으며, 성공 시 로그인 페이지로 이동합니다.

액세스 토큰은 sessionStorage에 저장하고 인증 요청에 Bearer 헤더로 전달합니다. 내 정보 API의 401 응답 시 토큰을 지우고 재로그인으로 안내합니다. 비밀번호는 저장하지 않습니다. 닉네임과 이메일은 서버 응답을 사용합니다. 프로필 이미지 업로드와 회원 탈퇴 API는 명세에 없으므로 이미지는 이메일별 localStorage에만 저장하고 탈퇴 버튼은 미지원 안내를 표시합니다.

백엔드의 허용 Origin은 `http://localhost:5173`입니다. 프런트엔드를 이 주소로 열어 주세요. 평점 API는 이번 회원 화면 구현 범위에 포함하지 않았습니다.

`npm run build`로 TypeScript 검사와 배포 빌드를 실행합니다.
