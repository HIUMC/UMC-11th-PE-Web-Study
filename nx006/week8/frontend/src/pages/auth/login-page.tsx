import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormField } from '../../components/form-field'
import { loginOptions } from '../../mutations/account-mutations'
import { memberFailure } from '../../api/members/member-api'
import { SessionChangedError } from '../../stores/auth-store'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const client = useQueryClient(), navigate = useNavigate()
  const mutation = useMutation(loginOptions(client))
  const locked = useRef(false)
  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length > 0
  return <main className="flex flex-1 items-center justify-center px-6 py-12" id="main-content"><form noValidate className="flex w-[430px] max-w-full flex-col gap-4" onSubmit={async event => {
    event.preventDefault()
    if (!canSubmit || mutation.isPending || locked.current) return
    locked.current = true
    try {
      await mutation.mutateAsync({ email: email.trim(), password })
      setPassword('')
      window.alert('로그인에 성공했어요.')
      await navigate({ to: '/' })
    } catch (error) { if (!(error instanceof SessionChangedError)) window.alert(memberFailure(error).message) }
    finally { locked.current = false }
  }} aria-busy={mutation.isPending}>
    <h1 className="text-[34px] leading-[41px] font-bold tracking-[-1.53px]">로그인</h1>
    <FormField id="login-email" label="이메일" type="email" autoComplete="email" placeholder="name@example.com" value={email} disabled={mutation.isPending} onChange={event => { setEmail(event.target.value); mutation.reset() }} icon="mail" />
    <FormField id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} disabled={mutation.isPending} onChange={event => { setPassword(event.target.value); mutation.reset() }} icon="lock" />
    {mutation.isError && <p role="alert" className="text-sm text-[#d92d20]">{memberFailure(mutation.error).message}</p>}
    <button className="inline-flex h-12 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={!canSubmit || mutation.isPending}>{mutation.isPending ? '로그인 중' : '로그인'}</button>
    <p className="pt-1 text-center text-[13px] text-[#606774]">처음이신가요? <Link className="text-xs font-extrabold text-[#2563eb]" to="/signup">회원가입</Link></p>
  </form></main>
}
