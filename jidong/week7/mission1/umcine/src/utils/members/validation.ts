// 이메일 형식 검사
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*) 모두 포함 8자 이상
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidNickname(nickname: string) {
  const length = nickname.trim().length;
  return length >= 2 && length <= 12;
}

export function isValidPassword(password: string) {
  return PASSWORD_REGEX.test(password);
}
