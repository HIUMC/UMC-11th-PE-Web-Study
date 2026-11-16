export const emptySignupForm = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

export type SignupForm = typeof emptySignupForm;

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,72}$/;

export function validateSignup(form: SignupForm) {
  const email = form.email.trim();
  const nickname = form.nickname.trim();

  return {
    email:
      email.length <= 254 && emailPattern.test(email)
        ? ""
        : "올바른 이메일 주소를 입력해 주세요.",
    nickname:
      nickname.length >= 2 && nickname.length <= 12
        ? ""
        : "닉네임을 2~12자로 입력해 주세요.",
    password: passwordPattern.test(form.password)
      ? ""
      : "영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8~72자로 입력해 주세요.",
    passwordConfirm:
      form.passwordConfirm !== "" && form.passwordConfirm === form.password
        ? ""
        : "비밀번호가 일치하지 않아요.",
  };
}
