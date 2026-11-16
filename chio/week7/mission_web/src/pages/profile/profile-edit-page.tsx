import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AuthField, AuthPanel, authButtonClass } from '../../components/auth/auth-form'
import { useProfilePreview } from './profile-preview-store'

export function ProfileEditPage() {
  const savedNickname = useProfilePreview((state) => state.nickname)
  const setNickname = useProfilePreview((state) => state.setNickname)
  const [nickname, setDraft] = useState(savedNickname)
  const navigate = useNavigate()
  const normalized = nickname.trim()
  const valid = normalized.length >= 2 && normalized.length <= 12

  return (
    <AuthPanel title="내 정보 수정">
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        if (!valid) return
        setNickname(normalized)
        void navigate({ to: '/profile' })
      }}>
        <AuthField id="profile-nickname" label="닉네임" name="nickname" autoComplete="nickname" value={nickname}
          invalid={!valid} message="닉네임은 2~12자로 입력해 주세요." onChange={(event) => setDraft(event.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Link className="grid min-h-12 place-items-center rounded-lg border border-[#dfe4eb] bg-white text-sm font-bold hover:bg-[#edf0f5]" to="/profile">취소</Link>
          <button type="submit" className={authButtonClass} disabled={!valid}>저장하기</button>
        </div>
      </form>
    </AuthPanel>
  )
}
