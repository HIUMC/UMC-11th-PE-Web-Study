# 8주차 프론트엔드 작업 지시서 (UMCine)

워크북: 8주차 - TanStack Query로 서버에 데이터 요청하기
https://app.notion.com/p/415e27fb3a6d80adbd74ccdaacf7b5fe

## 0. 작업 규칙 (반드시 지킬 것)

- 작업 폴더는 이 프로젝트(week8_frontend/umcine)다. 7주차 구조를 먼저 파악한다. 라우트 폴더, pages, hooks, api, stores 위치, import 별칭(@/) 사용 여부, 파일명 규칙을 확인하고 그에 맞춘다. 아래 워크북 코드는 참고안이며, 기존 코드의 이름과 경로에 맞게 조정한다.
- 코드와 주석에 이모지와 화살표 같은 특수 유니코드 기호를 쓰지 않는다. 사용자에게 보이는 한국어 문구는 괜찮다.
- git add, commit, push를 하지 않는다.
- .env.local을 수정하지 않는다.
- 백엔드는 http://localhost:8080 이고 소스는 E:\UMC_11th_Study\woni\woni\week8\week8_backend\movie 에 있다. 요청과 응답 형식은 백엔드의 Controller와 dto를 직접 읽어 확인한다. 백엔드는 수정하지 않는다. 수정이 필요해 보이면 멈추고 보고한다.
- Part마다 끝날 때 pnpm build 로 타입 검사와 빌드가 통과하는지 확인한다. 화면 동작은 사용자가 직접 확인한다.
- ky, React, TanStack Router 버전은 package.json 기준이다. 워크북 코드가 설치된 버전의 타입과 맞지 않으면(예: ky hooks 콜백 시그니처, React.SubmitEvent) 설치된 버전에 맞게 고치고 보고에 적는다.
- 진행 순서는 Part 1, Part 2, Part 3이다.
- 모두 끝나면 아래 네 가지를 보고한다.
  1. 생성하거나 수정한 파일 목록
  2. 사용자가 화면에서 확인해야 할 시나리오
  3. 작업 중 만난 오류와 원인, 해결 (오류 메시지 원문 포함, 트러블 슈팅 기록용)
  4. 워크북 코드와 다르게 한 점과 이유

---

## Part 1. 본문 1~3단원

### 1.2 회원가입 useMutation

src/hooks/use-signup-mutation.ts 를 만든다.

```ts
import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

export function useSignupMutation() {
  // const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);

      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
```

로그인 페이지가 이미 있으므로 navigate 주석은 해제해서 가입 성공 시 /login 으로 이동하게 한다.

signup-page.tsx 수정:

- 기존 signup import 를 useSignupMutation import 로 바꾼다.
- isSubmitting 상태를 제거한다.
- handleSubmit 을 아래로 교체한다.
- 가입하기 버튼의 isSubmitting 을 signupMutation.isPending 으로 바꾼다.

```ts
const signupMutation = useSignupMutation();

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!canSubmit || signupMutation.isPending) return;

  signupMutation.mutate({
    email: form.email.trim(),
    nickname: form.nickname.trim(),
    password: form.password,
  });
};
```

signup 함수가 응답 JSON(message 포함)을 반환하는지 확인한다.

### 2.2 토큰 저장소, 인증 API 인스턴스, 로그인, 내 정보

src/stores/auth-store.ts

```ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
```

src/api/auth-api.ts (기존 apiClient 는 그대로 두고 extend 로 만든다)

```ts
import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
```

src/api/auth/login.ts

```ts
import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}
```

src/api/members/me.ts (백엔드 GET /members/me 의 실제 응답을 확인해서 MemberInfo 를 맞춘다. memberId 가 응답에 있으면 MemberInfo 에 포함한다)

```ts
import { authApi } from "../auth-api";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}
```

### 2.3 헤더에 내 정보 조회 연결

header.tsx 에 아래를 추가한다.

```ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const accessToken = useAuthStore((state) => state.accessToken);
const meQuery = useQuery({
  queryKey: ["members", "me"],
  queryFn: getMe,
  enabled: Boolean(accessToken),
  staleTime: 5 * 60 * 1000,
  retry: false,
});
```

로그인 버튼 영역: 토큰이 없으면 로그인 링크, meQuery.isLoading 이면 버튼 크기의 로딩 표시, 그 외에는 기존 마이페이지 링크.

```tsx
{!accessToken ? (
  <Link to="/login">로그인</Link>
) : meQuery.isLoading ? (
  <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
) : (
  <Link to="/my">마이페이지</Link>
)}
```

기존 헤더의 클래스와 구조는 유지한다. 위 코드는 구조만 참고한다.

### 2.4 로그인 성공 처리

src/routes/login.tsx 에 beforeLoad 를 추가한다. 이미 로그인한 상태면 홈으로 보낸다.

```ts
import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login-page";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
```

src/hooks/use-login-mutation.ts

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
```

login-page.tsx 수정 (기존 입력값 상태 이름에 맞춘다)

```ts
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginMutation = useLoginMutation();
const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!canSubmit || loginMutation.isPending) return;

  loginMutation.mutate({
    email: form.email.trim(),
    password: form.password,
  });
};
```

폼에 onSubmit={handleSubmit} 을 연결하고 제출 버튼을 바꾼다.

```tsx
<button type="submit" disabled={!canSubmit || loginMutation.isPending}>
  {loginMutation.isPending ? "로그인 중" : "로그인"}
</button>
```

### 3.1 내 정보 수정과 setQueryData

백엔드 PATCH /members/me 의 요청과 응답을 확인하고 맞춘다.

src/api/members/update-me.ts

```ts
import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

interface UpdateMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}
```

src/hooks/use-update-me-mutation.ts

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
```

내 정보 수정 화면(기존 컴포넌트)에서 사용한다. 닉네임 길이 검사는 2자 이상 12자 이하다.

```ts
const updateMeMutation = useUpdateMeMutation();
const nickname = form.nickname.trim();
const canSubmit = nickname.length >= 2 && nickname.length <= 12;

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!canSubmit || updateMeMutation.isPending) return;

  updateMeMutation.mutate({ nickname });
};
```

```tsx
<button type="submit" disabled={!canSubmit || updateMeMutation.isPending}>
  {updateMeMutation.isPending ? "저장 중" : "저장"}
</button>
```

내 정보 화면은 임시 데이터 대신 useQuery(["members", "me"]) 의 값으로 닉네임과 이메일을 표시하도록 바꾼다. 즐겨찾기 임시 데이터는 Part 3에서 교체한다.

---

## Part 2. 필수 미션 1: 로그인 전용 폴더 (Route Group)

TanStack Router 의 Route Group 문법으로 로그인 후에만 접근할 수 있는 페이지(마이페이지, 내 정보 수정 등)를 같은 폴더로 묶는다.

- 참고: https://tanstack.com/router/latest/docs/routing/file-naming-conventions
- 그룹 폴더(예: (protected))를 만들고, 그 안에 공통 Layout Route 파일(route.tsx)을 둔다. Layout Route 는 beforeLoad 에서 accessToken 이 없으면 /login 으로 redirect 하고, component 는 <Outlet /> 을 렌더링한다.
- 마이페이지와 내 정보 수정 라우트를 그 그룹 폴더 안으로 옮긴다. 화면 URL(/my, /my/...)은 바뀌지 않아야 한다.
- 기존 7주차 routes/my 구조와 충돌하지 않게 정리한다. routeTree.gen.ts 는 자동 생성되므로 직접 수정하지 않는다.
- 토큰이 없을 때 /my 를 직접 열면 /login 으로 이동해야 한다.

---

## Part 3. 필수 미션 2: 남은 API 연결

이번이 마지막 API 연동이다. 데이터 흐름과 클라이언트 로직은 기존 코드 구조를 읽고 직접 설계한다. 인증이 필요한 요청은 모두 authApi 를 사용한다.

### 연결 대상

- 마이페이지: GET /favorites
- 영화 상세: GET /favorites/{movieId}, POST /favorites, DELETE /favorites/{movieId}
- 영화 상세: GET /members/{memberId}/ratings, POST /ratings, PATCH /ratings/{ratingId}, DELETE /ratings/{ratingId}

### 백엔드 응답 형식 (공통)

모든 응답은 isSuccess, code, message, result 형태다. 즐겨찾기 관련은 아래와 같다. 평점 관련 요청 본문과 응답은 백엔드 RatingController 와 dto 를 읽어 확인한다.

- POST /favorites: Body { movieId }, 201, result { favoriteId, movieId, createdAt }
- GET /favorites: result 는 { favoriteId, movieId, createdAt } 배열 (최신 등록 순, 비어 있으면 [])
- GET /favorites/{movieId}: result { isFavorite }
- DELETE /favorites/{movieId}: 200, result null
- 실패 코드: FAVORITE409_1(이미 즐겨찾기), FAVORITE404_1(해제할 즐겨찾기 없음)

### 구현 지침

- memberId: 평점 목록 조회에 memberId 가 필요하다. GET /members/me 응답에 memberId 가 있는지 백엔드를 읽어 확인한다. 있으면 MemberInfo 에 추가해 사용한다. 없으면 임의로 우회하지 말고 멈추고 보고한다.
- query key 는 일관되게 설계한다. 예: ["favorites"], ["favorites", movieId], ["ratings", memberId].
- 영화 상세의 즐겨찾기 버튼: 로그인 상태면 GET /favorites/{movieId} 로 초기 상태를 채우고(토큰 없으면 enabled false), 클릭 시 등록 또는 해제 mutation 을 실행한다. 성공하면 관련 캐시를 갱신한다. 토큰이 없을 때 클릭하면 /login 으로 이동시킨다.
- 마이페이지 즐겨찾기 목록: GET /favorites 는 movieId 만 준다. 영화 제목과 포스터는 기존 TMDB 영화 상세 조회 함수를 재사용해, useQueries 로 영화 ID마다 조회한 뒤 기존 카드 컴포넌트로 보여 준다. 비어 있을 때의 빈 상태 화면도 처리한다. 기존 임시 데이터는 제거한다.
- 평점: 영화 상세에서 내 평점 목록(GET /members/{memberId}/ratings)에서 현재 영화의 평점을 찾아 보여 준다. 평점이 없으면 등록(POST), 있으면 수정(PATCH)과 삭제(DELETE) 가 가능해야 한다. 변경이 성공하면 화면에 바로 반영한다.
- 캐시 갱신 방식(선택 미션 1 비교용): 닉네임 수정은 이미 setQueryData 를 쓴다. 즐겨찾기나 평점 변경 중 최소 한 곳은 invalidateQueries 를 쓰고, 어떤 곳에 어떤 방식을 썼는지 보고에 적는다.
- 각 mutation 은 hooks 폴더에 훅으로 분리하고, 요청 함수는 api 폴더에 둔다. 7주차까지의 폴더 구조와 이름 규칙을 따른다.
- 화면 디자인은 기존 영화 상세와 마이페이지 스타일을 유지한다. 새 디자인을 만들지 않는다.

### 완료 기준

- pnpm build 통과
- 보고에 사용자가 직접 확인할 시나리오를 번호 순서로 적는다. 로그인 후 즐겨찾기 등록, 해제, 마이페이지 목록 반영, 평점 등록, 수정, 삭제, 비로그인 상태 동작을 포함한다.
