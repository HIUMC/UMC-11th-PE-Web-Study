import { Link } from '@tanstack/react-router'
import { AuthPanel, authButtonClass } from '../../components/auth/auth-form'
import { useProfilePreview } from './profile-preview-store'

export function ProfilePage() {
  const nickname = useProfilePreview((state) => state.nickname)

  return (
    <AuthPanel title="내 정보">
      <p className="mb-4 text-sm text-[#697383]">예시 계정의 정보입니다.</p>
      <dl className="divide-y divide-[#e4e7eb] rounded-lg border border-[#dfe4eb] bg-white px-4">
        <div className="py-3"><dt className="text-xs font-bold">이메일</dt><dd className="mt-1 text-sm">name@example.com</dd></div>
        <div className="py-3"><dt className="text-xs font-bold">닉네임</dt><dd className="mt-1 break-all text-sm">{nickname}</dd></div>
        <div className="py-3"><dt className="text-xs font-bold">가입일</dt><dd className="mt-1 text-sm"><time dateTime="2026-01-01">2026. 1. 1.</time></dd></div>
      </dl>
      <Link className={`${authButtonClass} mt-4 w-full`} to="/profile/edit">내 정보 수정</Link>
    </AuthPanel>
  )
}
