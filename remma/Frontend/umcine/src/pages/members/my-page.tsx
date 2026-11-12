import { Link, Navigate } from "@tanstack/react-router";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import { useLogout } from "../../hooks/use-logout";
import { useAuthStore } from "../../stores/auth-store";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myInfoQuery = useMyInfoQuery();
  const logout = useLogout();

  // 1. 토큰이 만료되어 로그아웃된 경우 로그인 페이지로 이동
  if (accessToken === null) {
    return <Navigate to="/login" search={{ redirect: "/me" }} replace />;
  }

  // 2. 로딩 상태
  if (myInfoQuery.isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">내 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // 3. 오류 상태
  if (myInfoQuery.isError) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-900">내 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => myInfoQuery.refetch()}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          다시 시도하기
        </button>
      </main>
    );
  }

  const member = myInfoQuery.data;

  // 4. 성공 상태
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-950">내 정보</h1>
        <p className="mt-1 text-sm text-gray-500">UMCine 계정 정보를 확인해 보세요.</p>

        {/* 1. 프로필 요약 */}
        <div className="mt-8 flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white"
          >
            {member.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-950">{member.nickname}</p>
            <p className="truncate text-sm text-gray-500">{member.email}</p>
          </div>
        </div>

        {/* 2. 상세 정보 */}
        <dl className="mt-8 divide-y divide-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3.5">
            <dt className="text-sm font-semibold text-gray-500">이메일</dt>
            <dd className="text-sm text-gray-900">{member.email}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <dt className="text-sm font-semibold text-gray-500">닉네임</dt>
            <dd className="text-sm text-gray-900">{member.nickname}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <dt className="text-sm font-semibold text-gray-500">비밀번호</dt>
            <dd className="text-sm tracking-widest text-gray-900">••••••••</dd>
          </div>
        </dl>

        {/* 3. 액션 버튼 */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/me/edit"
            className="w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            정보 수정
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </main>
  );
}

export default MyPage;
