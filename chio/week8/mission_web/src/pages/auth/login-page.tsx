import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../../api/members'
import { apiErrorMessage } from '../../api/api-response'
import { meKey } from '../../queries/member'
import { useAuthStore } from '../../stores/auth-store'
import { AuthField, AuthPanel, authButtonClass } from '../../components/auth/auth-form'
import { cn } from '../../utils/cn'

declare module '@tanstack/react-router' {
  interface HistoryState {
    signupMessage?: string
  }
}

export function LoginPage() {
  const signupMessage = useLocation({ select: (location) => location.state.signupMessage })
  const client = useQueryClient()
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      useAuthStore.getState().setAccessToken(accessToken)
      void client.invalidateQueries({ queryKey: meKey })
      return navigate({ to: '/', replace: true })
    },
  })

  return (
    <AuthPanel title="로그인">
      {signupMessage && <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{signupMessage}</p>}
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending) return
        const form = new FormData(event.currentTarget)
        mutation.mutate({ email: String(form.get('email')).trim(), password: String(form.get('password')) })
      }}>
        <AuthField id="login-email" name="email" type="email" label="이메일" icon="mail"
          autoComplete="email" placeholder="name@example.com" required disabled={mutation.isPending} />
        <AuthField id="login-password" name="password" type="password" label="비밀번호" icon="lock"
          autoComplete="current-password" placeholder="비밀번호" required disabled={mutation.isPending} />
        <button className={cn(authButtonClass, 'w-full')} type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '로그인 중' : '로그인'}
        </button>
        {mutation.isError && <p role="alert" className="text-sm text-red-700">{apiErrorMessage(mutation.error, '로그인에 실패했어요. 다시 시도해 주세요.')}</p>}
      </form>
      <p className="mt-5 text-center text-xs text-[#697383]">
        처음이신가요? <Link className="font-bold text-[#245feb] hover:underline" to="/signup">회원가입</Link>
      </p>
    </AuthPanel>
  )
}
