// src/main/java/com/umc/movie/resolver/LoginMemberArgumentResolver.java
package com.umc.movie.resolver;

import com.umc.movie.annotation.LoginMember;
import com.umc.movie.exception.ApiException;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // @LoginMember가 붙은 Long 파라미터를 처리
        return parameter.hasParameterAnnotation(LoginMember.class)
                && parameter.getParameterType() == Long.class;
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        // 인터셉터가 현재 요청에 저장한 회원 ID를 꺼냄
        Object memberId = webRequest.getAttribute(
                AuthInterceptor.MEMBER_ID,
                RequestAttributes.SCOPE_REQUEST
        );

        if (memberId instanceof Long id) {
            return id;
        }

        throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                "AUTH401_2",
                "로그인이 필요한 요청입니다."
        );
    }
}