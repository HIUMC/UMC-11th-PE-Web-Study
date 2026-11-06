package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(
            @PathVariable("nickname")
            @NotBlank
            @Size(min = 2, max = 12)
            String nickname
    ) {
        return ApiResponse.ok(
                "닉네임 확인에 성공했습니다.",
                memberService.checkNickname(nickname)
        );
    }

    @GetMapping("/email/{email}")
    public ApiResponse<EmailCheckResponse> checkEmail(
            @PathVariable("email")
            @NotBlank
            @Email
            @Size(max = 254)
            String email
    ) {
        return ApiResponse.ok(
                "이메일 확인에 성공했습니다.",
                memberService.checkEmail(email)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "회원가입에 성공했습니다.",
                        memberService.signUp(request)
                ));
    }
}