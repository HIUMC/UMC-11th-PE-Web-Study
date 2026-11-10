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

    // 이 리졸버가 처리할 파라미터인지 판단합니다.
    // @LoginMember가 붙어 있고 타입이 Long이면 처리 대상입니다.
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(LoginMember.class)
                && Long.class.equals(parameter.getParameterType());
    }

    // 처리 대상일 때 실제로 넣어줄 값을 만듭니다.
    // 인터셉터가 request에 담아둔 memberId를 꺼냅니다.
    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        Object memberId = webRequest.getAttribute(
                AuthInterceptor.MEMBER_ID, RequestAttributes.SCOPE_REQUEST);

        // 인터셉터를 거치지 않는(열어둔) 경로에 @LoginMember를 잘못 붙였을 때의 안전장치입니다.
        if (memberId == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "로그인이 필요한 요청입니다.");
        }

        return memberId;
    }
}