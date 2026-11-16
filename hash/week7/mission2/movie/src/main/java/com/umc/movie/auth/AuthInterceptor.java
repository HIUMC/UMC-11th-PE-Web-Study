package com.umc.movie.auth;

import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID_ATTRIBUTE = "authenticatedMemberId";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(
            HttpServletRequest request, HttpServletResponse response, Object handler
    ) {
        if (CorsUtils.isPreFlightRequest(request)
                || !(handler instanceof HandlerMethod method)
                || method.hasMethodAnnotation(PublicEndpoint.class)) {
            return true;
        }

        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization == null
                || !authorization.regionMatches(
                true, 0, BEARER_PREFIX, 0, BEARER_PREFIX.length()
        )) {
            throw new BusinessException(ErrorCode.TOKEN_REQUIRED);
        }

        String token = authorization.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty()) {
            throw new BusinessException(ErrorCode.TOKEN_REQUIRED);
        }

        request.setAttribute(MEMBER_ID_ATTRIBUTE, jwtUtil.getMemberId(token));
        return true;
    }
}