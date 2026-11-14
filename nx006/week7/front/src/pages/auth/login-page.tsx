import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FormField } from '../../components/form-field'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return <main className="flex flex-1 items-center justify-center px-6 py-12" id="main-content"><form className="flex w-[430px] max-w-full flex-col gap-4" onSubmit={event => event.preventDefault()}>
    <h1 className="text-[34px] leading-[41px] font-bold tracking-[-1.53px]">로그인</h1>
    <FormField id="login-email" label="이메일" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={event => setEmail(event.target.value)} icon="mail" />
    <FormField id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={event => setPassword(event.target.value)} icon="lock" />
    <button className="inline-flex h-12 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white opacity-40" type="submit" disabled aria-describedby="login-preview-notice">로그인</button>
    <p id="login-preview-notice" className="text-xs leading-5 text-[#606774]">화면 실습입니다. 로그인 API는 8주차에 연결합니다.</p>
    <p className="pt-1 text-center text-[13px] text-[#606774]">처음이신가요? <Link className="text-xs font-extrabold text-[#2563eb]" to="/signup">회원가입</Link></p>
  </form></main>
}
