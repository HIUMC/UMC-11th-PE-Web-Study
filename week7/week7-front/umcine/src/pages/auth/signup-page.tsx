import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";
// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const [isSubmitting, setIsSubmitting] = useState(false);
const navigate = useNavigate();

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};
const [duplicateCheck, setDuplicateCheck] = useState({
  email: DEFAULT_DUPLICATE_CHECK,
  nickname: DEFAULT_DUPLICATE_CHECK,
});

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

const canSubmit =
  isFormValid &&
  duplicateCheck.email.isAvailable &&
  duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
  if (key === "email" || key === "nickname") {
    if (duplicateCheck[key].isChecking) return;
    // 확인한 값을 바꾸면 다시 중복 확인해야 함
    setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
  }
  setForm((prev) => ({ ...prev, [key]: value }));
};
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
  const isValid = key === "email" ? isEmailValid : isNicknameValid;
  if (!isValid || duplicateCheck[key].isChecking) return;

  const label = key === "email" ? "이메일" : "닉네임";
  setDuplicateCheck((prev) => ({
    ...prev,
    [key]: { isChecking: true, isAvailable: false },
  }));

  try {
    const response =
      key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
    const isAvailable = response.available;
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { ...prev[key], isAvailable },
    }));
    alert(
      isAvailable
        ? `사용할 수 있는 ${label}이에요.`
        : `이미 사용 중인 ${label}이에요.`,
    );
  } catch {
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { ...prev[key], isAvailable: false },
    }));
    alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { ...prev[key], isChecking: false },
    }));
  }
};
const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isSubmitting) return;

  setIsSubmitting(true);
  try {
    const response = await signup({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
    alert(response.message);
    // 로그인 페이지 연결 후 주석 해제
    // navigate({ to: "/login" });
  } catch {
    alert("회원가입에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setIsSubmitting(false);
  }
};
  
  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
	  <form onSubmit={handleSubmit} noValidate>
      {/* UI 구현 */}
      <button type="submit" disabled={!canSubmit || isSubmitting}>
  {isSubmitting ? "가입 중" : "가입하기"}
</button>
	  </form>
  )
}