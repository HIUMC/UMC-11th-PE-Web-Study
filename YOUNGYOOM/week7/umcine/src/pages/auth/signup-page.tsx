import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { Link } from "@tanstack/react-router";
import { signup } from "../../api/members/signup";
import { useNavigate } from "@tanstack/react-router";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

//typeof DEFAULT_FROM 으로 객체의 타입을 가져오고, keyof로 키만 뽑기
type DefaultFormKey = keyof typeof DEFAULT_FORM;
//위 키들에 해당하는 값의 타입만 뽑기 -> 결과는 string(전부 string이므로)
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  /*const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const emailRequest = useRef(0);
  const emailInput = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const nicknameRequest = useRef(0);


  async function handleCheckEmail() {
    if (!emailInput.current?.reportValidity()) return;
    const requestId = ++emailRequest.current;
    setIsCheckingEmail(true);
    setEmailMessage("");
    try {
      const { available } = await checkEmail(email);
      console.log("이메일 중복 여부", available);
      if (requestId === emailRequest.current) {
        setEmailMessage(
          available
            ? "사용 가능한 이메일입니다."
            : "이미 사용 중인 이메일입니다.",
        );
      }
    } catch {
      if (requestId === emailRequest.current) {
        setEmailMessage("이메일 확인에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      if (requestId === emailRequest.current) setIsCheckingEmail(false);
    }
  }

  async function handleCheckNickname() {
    const requestId = ++nicknameRequest.current;
    if (nickname.length < 2 || nickname.length > 12) {
      //기본 제약조건
      setNicknameMessage("닉네임은 2–12자로 입력해 주세요.");
      return;
    }
    setIsCheckingNickname(true);
    setNicknameMessage("");
    try {
      const { available } = await checkNickname(nickname);
      console.log("닉네임 중복 여부", available);
      if (requestId === nicknameRequest.current) {
        setNicknameMessage(
          available
            ? "사용 가능한 닉네임입니다."
            : "이미 사용 중인 닉네임입니다.",
        );
      }
    } catch {
      if (requestId === nicknameRequest.current) {
        setNicknameMessage("닉네임 확인에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      if (requestId === nicknameRequest.current) setIsCheckingNickname(false);
    }
  }*/
  //입력값 네개 다 상태객체로 관리
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

  const labelClassName = "mb-1.5 block text-xs font-semibold";
  const errorClassName = "mt-1.5 text-xs text-red-600";

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  //값이 들어있고, 유효성 검사에 실패한 필드만 오류 표시 조건이 참이 됨
  //입력값을 전부 지워서 다시 빈 문자열이 되면 오류 표시 조건도 거짓이 됨
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  //네 필드가 모두 유효해야 가입하기 필드 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordConfirmValid &&
    isPasswordValid;

  //어떤 입력칸이 바뀌었는지 key로 받아서 해당 필드만 갱신
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      // 중복 확인 요청이 진행 중이면 해당 입력값의 변경을 막음
      if (duplicateCheck[key].isChecking) return;

      // 입력값이 바뀌면 이전 값의 중복 확인 결과를 초기화
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    //선택한 입력칸 형식이 올바른지 확인
    const isValid = key === "email" ? isEmailValid : isNicknameValid;

    //향식 오류 혹은 이미 확인 진행중 -> API 호출 안함
    if (!isValid || duplicateCheck[key].isChecking) return;

    //결과 알림에 표시할 입력칸 이름
    const label = key === "email" ? "이메일" : "닉네임";

    //해당 입력칸을 확인중으로 바꾸고 이전 확인 결과 초기화
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
      //요청 실패시 사용 가능 확인을 받지 못했으므로 false로 저장
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      //요청의 성공 여부와 관계 없이 확인 중 상태 해제
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

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
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  //입력 조건과 두 중복 확인을 모두 통과해야 제출 가능

  //noValidate로 제출 시 브라우저의 기본 유효성 검사 끔
  return (
    <main className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-3xl font-bold">회원가입</h1>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold"
            >
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                onChange={(e) => handleChangeField("email", e.target.value)}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                value={form.email}
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 text-xs font-semibold text-blue-600"
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className={errorClassName}>이메일 형식을 확인해주세요</p>
            )}
          </div>
          <div>
            <label
              htmlFor="nickname"
              className="mb-1.5 block text-xs font-semibold"
            >
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                name="nickname"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                autoComplete="nickname"
                placeholder="2–12자"
                minLength={2}
                maxLength={12}
                required
                className={`${inputClassName} pr-24`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 text-xs font-semibold text-blue-600"
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className={errorClassName}>닉네임 형식을 확인해주세요.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              minLength={8}
              required
              aria-describedby="password-help"
              className={inputClassName}
              onChange={(e) => handleChangeField("password", e.target.value)}
              value={form.password}
            />

            {showPasswordError && (
              <p className={errorClassName}>
                영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
                주세요
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password-confirm"
              className="mb-1.5 block text-xs font-semibold"
            >
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="다시 입력"
              minLength={8}
              required
              className={inputClassName}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              value={form.passwordConfirm}
            />
          </div>
          {showPasswordConfirmError && (
            <p className={errorClassName}>확인 비밀번호 형식을 확인해주세요.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
