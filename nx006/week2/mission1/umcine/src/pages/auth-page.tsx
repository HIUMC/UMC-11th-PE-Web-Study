import { useState } from 'react'
import { FormField } from '../components/form-field'
import type { Profile } from '../types/profile'

interface Props {
  signup: boolean
  onSubmit: (profile: Profile, password: string) => string | undefined
  checkAvailable: (field: 'email' | 'nickname', value: string) => boolean
}

export function AuthPage({ signup, onSubmit, checkAvailable }: Props) {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  function check(field: 'email' | 'nickname', value: string) {
    const valid = field === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : value.trim().length >= 2 && value.trim().length <= 12
    setMessage(!valid ? `${field === 'email' ? '이메일 형식' : '닉네임 길이(2–12자)'}을 확인해 주세요.` : checkAvailable(field, value.trim()) ? '사용할 수 있어요.' : '이미 사용 중이에요.')
  }
  return <main className="auth-pane" id="main-content"><form className="auth-form" onSubmit={event => {
    event.preventDefault()
    if (signup && password !== confirmation) { setMessage('비밀번호가 일치하지 않아요.'); return }
    setMessage(onSubmit({ email: email.trim().toLowerCase(), nickname: nickname.trim() }, password) ?? '')
  }}>
    <h1>{signup ? '회원가입' : '로그인'}</h1>
    <FormField id="email" label="이메일" type="email" autoComplete="email" placeholder="name@example.com" required value={email} onChange={event => setEmail(event.target.value)} icon={signup ? undefined : 'mail'} action={signup && <button className="text-link" type="button" onClick={() => check('email', email)}>중복 확인</button>} />
    {signup && <FormField id="nickname" label="닉네임" autoComplete="nickname" placeholder="2–12자" minLength={2} maxLength={12} required value={nickname} onChange={event => setNickname(event.target.value)} action={<button className="text-link" type="button" onClick={() => check('nickname', nickname)}>중복 확인</button>} />}
    <FormField id="password" label="비밀번호" type="password" autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? '8자 이상' : '비밀번호'} minLength={8} required value={password} onChange={event => setPassword(event.target.value)} icon={signup ? undefined : 'lock'} pattern={signup ? '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}' : undefined} title={signup ? '영문 대·소문자, 숫자, 특수문자를 포함한 8자 이상' : undefined} hint={signup ? '영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요' : undefined} />
    {signup && <FormField id="confirmation" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="다시 입력" required value={confirmation} onChange={event => setConfirmation(event.target.value)} />}
    {message && <p className="form-message" role="status">{message}</p>}
    <button className="button primary auth-submit" type="submit">{signup ? '가입하기' : '로그인'}</button>
    <p className="auth-footer">{signup ? '이미 계정이 있나요? ' : '처음이신가요? '}<a className="text-link" href={signup ? '#/login' : '#/signup'}>{signup ? '로그인' : '회원가입'}</a></p>
  </form></main>
}
