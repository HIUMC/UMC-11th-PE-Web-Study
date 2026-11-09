package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID = "memberId";

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        // 1. OPTIONS 요청은 통과
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        // 2. Authorization 헤더 가져오기
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 3. 토큰이 없거나 Bearer 형식이 아니면 예외 발생
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_2",
                    "로그인이 필요한 요청입니다."
            );
        }

        // 4. Bearer 접두사 제거 후 JWT 검증
        Long memberId = jwtUtil.getMemberId(
                header.substring(BEARER_PREFIX.length())
        );

        // 5. 검증된 회원 ID를 요청에 저장
        request.setAttribute(MEMBER_ID, memberId);

        // 6. Controller 실행 허용
        return true;
    }

}