import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { checkDuplicate, memberFailure, signup, type DuplicateField } from '../api/members/member-api'
import { canSubmitSignup, emptyDuplicate, emptySignupForm, validateSignup, type SignupForm } from '../utils/signup-validation'

export function useSignup() {
  const [form, setForm] = useState({ ...emptySignupForm })
  const [touched, setTouched] = useState<Partial<Record<keyof SignupForm, boolean>>>({})
  const [duplicates, setDuplicates] = useState({ email: emptyDuplicate(), nickname: emptyDuplicate() })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const current = useRef({ form, duplicates })
  const submitting = useRef(false)
  const mounted = useRef(true)
  const checks = useRef<Partial<Record<DuplicateField, AbortController>>>({})
  useEffect(() => {
    mounted.current = true
    const activeChecks = checks.current
    return () => { mounted.current = false; Object.values(activeChecks).forEach(controller => controller?.abort()) }
  }, [])

  function change(field: keyof SignupForm, value: string) {
    if (submitting.current || ((field === 'email' || field === 'nickname') && checks.current[field])) return
    const nextForm = { ...current.current.form, [field]: value }
    const nextDuplicates = { ...current.current.duplicates }
    if (field === 'email' || field === 'nickname') nextDuplicates[field] = emptyDuplicate()
    current.current = { form: nextForm, duplicates: nextDuplicates }
    setForm(nextForm); setDuplicates(nextDuplicates); setTouched(prev => ({ ...prev, [field]: true })); setMessage('')
  }
  async function check(field: DuplicateField) {
    if (submitting.current || checks.current[field] || !validateSignup(current.current.form)[field]) return
    const value = current.current.form[field].trim()
    const controller = new AbortController()
    checks.current[field] = controller
    const update = (state: ReturnType<typeof emptyDuplicate>) => {
      current.current.duplicates = { ...current.current.duplicates, [field]: state }
      setDuplicates(current.current.duplicates)
    }
    update({ isChecking: true, isAvailable: false, checkedValue: '' })
    try {
      const available = await checkDuplicate(field, value, controller.signal)
      if (!mounted.current || controller.signal.aborted || current.current.form[field].trim() !== value) return
      update({ isChecking: true, isAvailable: available, checkedValue: value })
      const text = available ? '사용할 수 있어요.' : `이미 사용 중인 ${field === 'email' ? '이메일' : '닉네임'}이에요.`
      setMessage(text); window.alert(text)
    } catch (error) {
      if (!mounted.current || controller.signal.aborted) return
      update({ ...emptyDuplicate(), isChecking: true })
      const failure = await memberFailure(error)
      if (!mounted.current) return
      setMessage(failure.message); window.alert(failure.message)
    } finally {
      if (checks.current[field] === controller) {
        delete checks.current[field]
        if (mounted.current) update({ ...current.current.duplicates[field], isChecking: false })
      }
    }
  }
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || !canSubmitSignup(current.current.form, current.current.duplicates)) return
    submitting.current = true; setIsSubmitting(true); setMessage('')
    const snapshot = { ...current.current.form }
    try {
      await signup({ email: snapshot.email.trim(), nickname: snapshot.nickname.trim(), password: snapshot.password })
      if (!mounted.current) return
      const text = '회원가입에 성공했습니다. 로그인 API는 다음 주차에 연결합니다.'
      setMessage(text); window.alert(text)
      // 가입을 로그인으로 취급하지 않는다. 반복 가입 전 중복 확인을 다시 요구한다.
      const nextDuplicates = { email: emptyDuplicate(), nickname: emptyDuplicate() }
      const nextForm = { ...snapshot, password: '', passwordConfirm: '' }
      current.current = { form: nextForm, duplicates: nextDuplicates }
      setForm(nextForm); setDuplicates(nextDuplicates); setTouched({})
    } catch (error) {
      const failure = await memberFailure(error)
      if (!mounted.current) return
      if (failure.status === 409) {
        const next = { ...current.current.duplicates }
        if (failure.duplicateField) next[failure.duplicateField] = emptyDuplicate()
        else { next.email = emptyDuplicate(); next.nickname = emptyDuplicate() }
        current.current.duplicates = next; setDuplicates(next)
      }
      setMessage(failure.message); window.alert(failure.message)
    } finally {
      submitting.current = false
      if (mounted.current) setIsSubmitting(false)
    }
  }
  return { form, touched, duplicates, isSubmitting, message, validity: validateSignup(form), canSubmit: canSubmitSignup(form, duplicates), change, check, submit }
}
