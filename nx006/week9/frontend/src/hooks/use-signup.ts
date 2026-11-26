import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signupOptions } from '../mutations/account-mutations'
import { checkDuplicate, memberFailure, type DuplicateField } from '../api/members/member-api'
import { canSubmitSignup, emptyDuplicate, emptySignupForm, validateSignup, type SignupForm } from '../utils/signup-validation'

export function useSignup() {
  const [form, setForm] = useState({ ...emptySignupForm })
  const [touched, setTouched] = useState<Partial<Record<keyof SignupForm, boolean>>>({})
  const [duplicates, setDuplicates] = useState({ email: emptyDuplicate(), nickname: emptyDuplicate() })
  const [message, setMessage] = useState('')
  const current = useRef({ form, duplicates })
  const submitting = useRef(false)
  const mounted = useRef(true)
  const checks = useRef<Partial<Record<DuplicateField, AbortController>>>({})
  const router = useRouter()
  const mutation = useMutation({
    ...signupOptions(),
    onSuccess: () => {
      if (!mounted.current) return
      const nextForm = { ...current.current.form, password: '', passwordConfirm: '' }
      const nextDuplicates = { email: emptyDuplicate(), nickname: emptyDuplicate() }
      current.current = { form: nextForm, duplicates: nextDuplicates }
      setForm(nextForm); setDuplicates(nextDuplicates); setTouched({})
      window.alert('회원가입에 성공했습니다. 로그인해 주세요.')
      router.push('/login')
    },
    onError: error => {
      if (!mounted.current) return
      const failure = memberFailure(error)
      if (failure.status === 409) {
        const next = { ...current.current.duplicates }
        if (failure.duplicateField) next[failure.duplicateField] = emptyDuplicate()
        else { next.email = emptyDuplicate(); next.nickname = emptyDuplicate() }
        current.current.duplicates = next; setDuplicates(next)
      }
      window.alert(failure.message)
    },
    onSettled: () => { submitting.current = false },
  })
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
    mutation.reset()
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
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || mutation.isPending || !canSubmitSignup(current.current.form, current.current.duplicates)) return
    submitting.current = true; setMessage('')
    const snapshot = current.current.form
    mutation.mutate({ email: snapshot.email.trim(), nickname: snapshot.nickname.trim(), password: snapshot.password })
  }
  return { form, touched, duplicates, isSubmitting: mutation.isPending, message: mutation.isError ? memberFailure(mutation.error).message : message, validity: validateSignup(form), canSubmit: canSubmitSignup(form, duplicates), change, check, submit }
}
