package com.umc.movie.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

//컨트롤러 메서드의 파라미터에 붙일 수 있음
@Target(ElementType.PARAMETER)
//실행중에도 스프링이 이 어노테이션을 확인할수 있게 함
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginMember {
}
