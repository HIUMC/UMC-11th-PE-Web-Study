import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { checkMemberAvailability, type MemberInfo } from '../../api/members'
import { apiErrorMessage } from '../../api/api-response'
import { authButtonClass } from '../../components/auth/auth-form'
import { useMe, useUpdateMe } from '../../queries/member'

export function ProfileEditPage() {
  const me = useMe()
  return me.data ? <ProfileForm key={me.data.email} member={me.data} /> : (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1336px] py-7">
      <h1 className="mb-3 text-[30px] font-extrabold">내 정보 수정</h1>
      {me.isError ? <button className={authButtonClass} onClick={() => void me.refetch()}>내 정보 다시 불러오기</button>
        : <p role="status">내 정보를 불러오는 중이에요.</p>}
    </main>
  )
}

function ProfileForm({ member }: { member: MemberInfo }) {
  const [nickname, setNickname] = useState(member.nickname)
  const update = useUpdateMe()
  const check = useMutation({ mutationFn: (value: string) => checkMemberAvailability('nickname', value) })

  const normalized = nickname.trim()
  const changed = normalized !== member.nickname
  const valid = normalized.length >= 2 && normalized.length <= 12
  const checkingCurrent = check.variables === normalized
  const available = checkingCurrent && check.data?.available
  const busy = update.isPending
  const canSave = valid && changed && available && !busy
  const fieldClass = 'min-h-[51px] w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm text-[#181a1f]'

  return (
    <main className="mx-auto flex w-[calc(100%-48px)] max-w-[1336px] flex-col pt-6 pb-7 max-[680px]:w-[calc(100%-32px)]">
      <form onSubmit={(event) => {
        event.preventDefault()
        if (!canSave) return
        update.mutate(normalized, {
          onSuccess: (result) => {
            setNickname(result.nickname)
            check.reset()
          },
        })
      }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[30px] leading-tight font-extrabold tracking-tight">내 정보 수정</h1>
            <p className="mt-3 text-sm text-[#697383]">닉네임을 변경할 수 있어요.</p>
          </div>
          <button className={`${authButtonClass} !min-h-[42px]`} type="submit" disabled={!canSave}>
            {update.isPending ? '저장 중' : '변경사항 저장'}
          </button>
        </div>

        <div className="mt-9 grid grid-cols-2 items-center gap-y-5 max-[680px]:grid-cols-1">
          <div className="flex flex-col items-center">
            <div className="mb-1 grid size-[86px] place-items-center rounded-full bg-[#e1e5ea]">
              <img className="size-10" src="/icons/person.svg" alt="" />
            </div>
            <span className="text-sm font-bold">프로필 이미지</span>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
              <div className={`${fieldClass} flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#245feb]`}>
                <input className="min-h-[49px] min-w-0 flex-1 outline-none" id="profile-nickname" autoComplete="nickname"
                  value={nickname} disabled={busy} aria-invalid={!valid} onChange={(event) => {
                    setNickname(event.target.value)
                    check.reset()
                    update.reset()
                  }} />
                <button type="button" className="shrink-0 text-xs font-bold text-[#245feb] disabled:opacity-60"
                  disabled={!valid || !changed || busy || check.isPending} onClick={() => check.mutate(normalized)}>
                  {check.isPending ? '확인 중' : '중복 확인'}
                </button>
              </div>
              {!valid && <p className="mt-1 text-xs text-red-700">닉네임은 2~12자로 입력해 주세요.</p>}
              {checkingCurrent && check.isSuccess && <p className={`mt-1 text-xs ${available ? 'text-blue-700' : 'text-red-700'}`} role="status">
                {available ? '사용할 수 있는 닉네임이에요.' : '이미 사용 중인 닉네임이에요.'}
              </p>}
              {checkingCurrent && check.isError && <p className="mt-1 text-xs text-red-700" role="alert">중복 확인에 실패했어요. 다시 시도해 주세요.</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold" htmlFor="profile-email">이메일</label>
              <input className={fieldClass} id="profile-email" type="email" value={member.email} readOnly />
            </div>
            {update.isSuccess && <p className="text-sm text-blue-700" role="status">변경사항을 저장했어요.</p>}
            {update.isError && <p className="text-sm text-red-700" role="alert">{apiErrorMessage(update.error, '저장에 실패했어요. 다시 시도해 주세요.')}</p>}
          </div>
        </div>
      </form>
    </main>
  )
}
