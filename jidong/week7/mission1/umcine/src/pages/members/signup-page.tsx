import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup } from "../../api/members/signup";
import { FormField } from "../../components/auth/form-field";
import {
  isValidEmail,
  isValidNickname,
  isValidPassword,
} from "../../utils/members/validation";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 유효성 검사
  const isEmailValid = isValidEmail(form.email);
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 true
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건이랑 중복 확인 두 개 모두 통과해야 제출 가능함
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 중복 확인 다시 해야 함
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
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());
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

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출할 때 새로고침 방지
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const duplicateCheckButton = (key: DuplicateCheckKey, isValid: boolean) => (
    <button
      type="button"
      disabled={!isValid || duplicateCheck[key].isChecking}
      onClick={() => handleCheckDuplicate(key)}
      className="shrink-0 text-xs font-bold text-blue-600 disabled:text-gray-300"
    >
      {duplicateCheck[key].isChecking
        ? "확인 중"
        : duplicateCheck[key].isAvailable
          ? "확인 완료"
          : "중복 확인"}
    </button>
  );

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      {/* noValidate로 브라우저 기본 유효성 검사 끔 */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[360px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>

        <FormField
          id="email"
          label="이메일"
          type="email"
          icon="/icons/mail.svg"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          disabled={duplicateCheck.email.isChecking}
          errorMessage={showEmailError ? "올바른 이메일 형식이 아니에요." : null}
          action={duplicateCheckButton("email", isEmailValid)}
          onChange={(value) => handleChangeField("email", value)}
        />

        <FormField
          id="nickname"
          label="닉네임"
          icon="/icons/person.svg"
          placeholder="2~12자"
          autoComplete="nickname"
          value={form.nickname}
          disabled={duplicateCheck.nickname.isChecking}
          errorMessage={
            showNicknameError ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null
          }
          action={duplicateCheckButton("nickname", isNicknameValid)}
          onChange={(value) => handleChangeField("nickname", value)}
        />

        <FormField
          id="password"
          label="비밀번호"
          type="password"
          icon="/icons/lock.svg"
          placeholder="8자 이상"
          autoComplete="new-password"
          value={form.password}
          errorMessage={
            showPasswordError
              ? "영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
              : null
          }
          onChange={(value) => handleChangeField("password", value)}
        />

        <FormField
          id="password-confirm"
          label="비밀번호 확인"
          type="password"
          icon="/icons/lock.svg"
          placeholder="다시 입력"
          autoComplete="new-password"
          value={form.passwordConfirm}
          errorMessage={
            showPasswordConfirmError ? "비밀번호가 일치하지 않아요." : null
          }
          onChange={(value) => handleChangeField("passwordConfirm", value)}
        />

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-2 rounded-md bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-blue-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
