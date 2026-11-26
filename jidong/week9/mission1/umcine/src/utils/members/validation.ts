export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
