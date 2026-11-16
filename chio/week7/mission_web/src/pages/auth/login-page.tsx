import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { AuthField, AuthPanel, authButtonClass } from '../../components/auth/auth-form'
import { cn } from '../../utils/cn'

declare module '@tanstack/react-router' {
  interface HistoryState {
    signupMessage?: string
  }
}

export function LoginPage() {
  const signupMessage = useLocation({ select: (location) => location.state.signupMessage })
  const [message, setMessage] = useState('')

  return (
    <AuthPanel title="로그인">
      {signupMessage && <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{signupMessage}</p>}
      <form className="grid gap-4" onSubmit={(event) => {
        event.preventDefault()
        setMessage('로그인 기능은 아직 연결되지 않았어요.')
      }}>
        <AuthField id="login-email" name="email" type="email" label="이메일" icon="mail"
          autoComplete="email" placeholder="name@example.com" required />
        <AuthField id="login-password" name="password" type="password" label="비밀번호" icon="lock"
          autoComplete="current-password" placeholder="비밀번호" required />
        <button className={cn(authButtonClass, 'w-full')} type="submit">로그인</button>
        {message && <p role="status" className="text-sm text-[#697383]">{message}</p>}
      </form>
      <p className="mt-5 text-center text-xs text-[#697383]">
        처음이신가요? <Link className="font-bold text-[#245feb] hover:underline" to="/signup">회원가입</Link>
      </p>
    </AuthPanel>
  )
}
