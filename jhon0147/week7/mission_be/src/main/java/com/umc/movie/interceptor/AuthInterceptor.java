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
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {
    public static final String MEMBER_ID = "loginMemberId";
    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (HttpMethod.OPTIONS.matches(request.getMethod()) || !(handler instanceof HandlerMethod)
                || isPublicRequest(request)) return true;

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.regionMatches(true, 0, "Bearer ", 0, 7)
                || header.substring(7).isBlank()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2", "로그인이 필요한 요청입니다.");
        }
        request.setAttribute(MEMBER_ID, jwtUtil.getMemberId(header.substring(7).trim()));
        return true;
    }

    private boolean isPublicRequest(HttpServletRequest request) {
        String path = request.getServletPath();
        if (path.isEmpty()) path = request.getRequestURI().substring(request.getContextPath().length());
        if (HttpMethod.POST.matches(request.getMethod())) {
            return path.equals("/auth/login") || path.equals("/members");
        }
        return HttpMethod.GET.matches(request.getMethod()) && (
                path.startsWith("/members/nickname/") || path.startsWith("/members/email/")
                        || path.matches("/members/[0-9]+/ratings"));
    }
}
