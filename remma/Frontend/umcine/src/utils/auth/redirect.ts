const DEFAULT_REDIRECT_PATH = "/";

/**
 * 로그인 후 이동할 경로를 검증해요.
 * 외부 사이트로 튕겨내는 open redirect를 막기 위해 같은 사이트의 절대 경로만 허용해요.
 */
export function getSafeRedirectPath(redirect: string | undefined) {
  if (
    !redirect ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    // 브라우저는 "/\evil.com"을 "//evil.com"처럼 해석해요.
    redirect.startsWith("/\\")
  ) {
    return DEFAULT_REDIRECT_PATH;
  }
  if (redirect.startsWith("/login")) {
    return DEFAULT_REDIRECT_PATH;
  }
  return redirect;
}
