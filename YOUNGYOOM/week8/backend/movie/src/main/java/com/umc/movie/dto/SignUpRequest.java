package com.umc.movie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;


//회원가입 요청의 이메일, 비번, 닉넴을 받는 DTO
public record SignUpRequest (
    //필수 입력값이며 이메일 형식에 맞아야함
    @NotBlank(message="이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    String email,
    //8자 이상, 영문 대/소문자 숫자 각각 하나 이상 포함해야 함
    //특수문자는 !@#$%^*중 하나를 포함해야함
    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
            message="비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다."
    )
    String password,

    //공백만으로 구성될 수 없고, 길이는 2자 이상 12자 이하
    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size(min=2, max=12, message="닉네임은 2자 이상 12자 이하로 입력해주세요")
    String nickname


    ){}
