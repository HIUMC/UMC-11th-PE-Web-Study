export interface SignupForm { email: string; nickname: string; password: string; passwordConfirm: string }
export const emptySignupForm: SignupForm = { email: '', nickname: '', password: '', passwordConfirm: '' }
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
export function validateSignup(form: SignupForm) {
  return {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: Array.from(form.nickname.trim()).length >= 2 && Array.from(form.nickname.trim()).length <= 12,
    // 백엔드 bcrypt의 72 byte 제한도 함께 만족시킨다. 허용 문자는 ASCII다.
    password: PASSWORD_REGEX.test(form.password) && form.password.length <= 72,
    passwordConfirm: form.passwordConfirm.length > 0 && form.password === form.passwordConfirm,
  }
}
export interface DuplicateState { isChecking: boolean; isAvailable: boolean; checkedValue: string }
export function emptyDuplicate(): DuplicateState { return { isChecking: false, isAvailable: false, checkedValue: '' } }
export function canSubmitSignup(form: SignupForm, duplicates: Record<'email' | 'nickname', DuplicateState>): boolean {
  return Object.values(validateSignup(form)).every(Boolean) && (['email', 'nickname'] as const).every(field => {
    const state = duplicates[field]
    return !state.isChecking && state.isAvailable && state.checkedValue === form[field].trim()
  })
}
