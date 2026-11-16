# UMCine - 7주차 mission 1

6주차 프로젝트 이어서 회원가입(본문 실습), 로그인 / 내 정보 조회·수정 화면(필수 미션) 구현함

## 실행

1. `.env.example` 복사해서 `.env.local` 만들고 값 채움
2. 회원가입, 중복 확인은 6주차 백엔드(`localhost:8080`) 켜고 확인
3. `pnpm install` → `pnpm dev`

## 화면

| 경로 | 내용 |
| --- | --- |
| `/signup` | 입력값 검증, 이메일·닉네임 중복 확인, `POST /members` 요청. 가입 성공하면 `/login`으로 이동 |
| `/login` | 이메일 형식, 비밀번호 입력 여부 검사. API는 8주차에 연결 예정 |
| `/mypage` | 닉네임, 이메일, 한 줄 소개, 내가 남긴 평점 |
| `/mypage/edit` | 닉네임(2~12자), 한 줄 소개(100자) 수정. 바뀐 값 있을 때만 저장 가능 |

- 내 정보 API는 아직 없어서 `profile-store.ts`(zustand + localStorage)에 저장함. 수정하면 `/mypage`에 바로 반영되고 새로고침해도 유지됨
- 폼 입력칸은 `form-field.tsx` 하나로 같이 씀, 검증 규칙은 `validation.ts`에 모아둠

## 확인

- `pnpm lint`, `pnpm build` 통과
- 각 URL 직접 접속 / 새로고침, 입력값 반영, Console 오류 없음 확인
