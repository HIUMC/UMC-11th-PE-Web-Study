import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { apiErrorMessage } from '../../api/api-response'
import { checkMemberAvailability, signup } from '../../api/members'
import { AuthField, AuthPanel, authButtonClass } from '../../components/auth/auth-form'
import { cn } from '../../utils/cn'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
const passwordHint = '영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.'
const initialForm = { email: '', nickname: '', password: '', passwordConfirm: '' }
const checkFields = ['email', 'nickname'] as const
const labels = { email: '이메일', nickname: '닉네임' }

type CheckField = (typeof checkFields)[number]
type CheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'failed'

export function SignupPage() {
  const [form, setForm] = useState(initialForm)
  const [checks, setChecks] = useState<Record<CheckField, CheckStatus>>({ email: 'idle', nickname: 'idle' })
  const navigate = useNavigate()
  const signupMutation = useMutation({
    mutationFn: async (input: Parameters<typeof signup>[0]) => {
      const response = await signup(input)
      if (!response.isSuccess) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => navigate({ to: '/login', state: { signupMessage: response.message } }),
  })
  const isSubmitting = signupMutation.isPending
  const submitError = signupMutation.isError
    ? apiErrorMessage(signupMutation.error, '회원가입에 실패했어요. 다시 시도해 주세요.')
    : ''

  const email = form.email.trim()
  const nickname = form.nickname.trim()
  const valid = { email: emailPattern.test(email), nickname: nickname.length >= 2 && nickname.length <= 12 }
  const validPassword = passwordPattern.test(form.password)
  const validConfirmation = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm
  const canSubmit = valid.email && valid.nickname && validPassword && validConfirmation &&
    checks.email === 'available' && checks.nickname === 'available' && !isSubmitting

  function changeField(key: keyof typeof initialForm, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }))
    signupMutation.reset()
    if (key === 'email' || key === 'nickname') {
      setChecks((previous) => ({ ...previous, [key]: 'idle' }))
    }
  }

  async function checkDuplicate(key: CheckField) {
    if (!valid[key] || checks[key] === 'checking' || isSubmitting) return
    setChecks((previous) => ({ ...previous, [key]: 'checking' }))
    try {
      const { available } = await checkMemberAvailability(key, key === 'email' ? email : nickname)
      setChecks((previous) => ({ ...previous, [key]: available ? 'available' : 'taken' }))
    } catch {
      setChecks((previous) => ({ ...previous, [key]: 'failed' }))
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    signupMutation.mutate({ email, nickname, password: form.password })
  }

  return (
    <AuthPanel title="회원가입">
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        {checkFields.map((key) => {
          const status = checks[key]
          const invalidFormat = form[key].length > 0 && !valid[key]
          const message = invalidFormat
            ? (key === 'email' ? '올바른 이메일을 입력해 주세요.' : '닉네임은 2~12자로 입력해 주세요.')
            : {
                idle: undefined,
                checking: undefined,
                available: `사용할 수 있는 ${labels[key]}이에요.`,
                taken: `이미 사용 중인 ${labels[key]}이에요.`,
                failed: '중복 확인에 실패했어요. 다시 시도해 주세요.',
              }[status]
          return (
            <AuthField key={key} id={`signup-${key}`} name={key} label={labels[key]}
              type={key === 'email' ? 'email' : 'text'} autoComplete={key}
              placeholder={key === 'email' ? 'name@example.com' : '2~12자'}
              value={form[key]} onChange={(event) => changeField(key, event.target.value)}
              disabled={status === 'checking' || isSubmitting} message={message}
              invalid={invalidFormat || status === 'taken' || status === 'failed'}
              action={
                <button type="button" className="min-h-9 shrink-0 text-xs font-bold text-[#245feb] disabled:cursor-not-allowed disabled:text-[#245feb]/65"
                  disabled={!valid[key] || status === 'checking' || isSubmitting} onClick={() => void checkDuplicate(key)}>
                  {status === 'checking' ? '확인 중' : '중복 확인'}
                  <span className="sr-only"> ({labels[key]})</span>
                </button>
              } />
          )
        })}
        <AuthField id="signup-password" name="password" label="비밀번호" type="password" autoComplete="new-password"
          placeholder="8자 이상" value={form.password} onChange={(event) => changeField('password', event.target.value)}
          disabled={isSubmitting} message={passwordHint} invalid={form.password.length > 0 && !validPassword} />
        <AuthField id="signup-confirm" name="passwordConfirm" label="비밀번호 확인" type="password" autoComplete="new-password"
          placeholder="다시 입력" value={form.passwordConfirm} onChange={(event) => changeField('passwordConfirm', event.target.value)}
          disabled={isSubmitting} invalid={form.passwordConfirm.length > 0 && !validConfirmation}
          message={form.passwordConfirm.length > 0 && !validConfirmation ? '비밀번호가 일치하지 않아요.' : undefined} />
        <button className={cn(authButtonClass, 'w-full')} type="submit" disabled={!canSubmit}>
          {isSubmitting ? '가입 중' : '가입하기'}
        </button>
        {submitError && <p className="text-sm text-red-700" role="alert">{submitError}</p>}
      </form>
      <p className="mt-5 text-center text-xs text-[#697383]">
        이미 계정이 있나요? <Link className="font-bold text-[#245feb] hover:underline" to="/login">로그인</Link>
      </p>
    </AuthPanel>
  )
}
