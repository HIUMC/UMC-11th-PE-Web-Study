export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export const DEFAULT_SIGNUP_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
export type SignupForm = typeof DEFAULT_SIGNUP_FORM;

export function isNicknameValid(nickname: string): boolean {
  const length = nickname.trim().length;
  return length >= 2 && length <= 12;
}

export function validateSignupForm(form: SignupForm) {
  return {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: isNicknameValid(form.nickname),
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm: form.passwordConfirm.length > 0 && form.password === form.passwordConfirm,
  };
}
