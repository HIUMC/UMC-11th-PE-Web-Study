package com.umc.movie.controller;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.auth.PublicEndpoint;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
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

    @PublicEndpoint
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

    @PublicEndpoint
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

    @GetMapping("/me")
    public ApiResponse<MemberInfoResponse> getMyInfo(@LoginMember Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    public ApiResponse<MemberInfoResponse> updateMyInfo(
            @LoginMember Long memberId, @Valid @RequestBody MemberUpdateRequest request
    ) {
        return ApiResponse.ok(
                "회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request)
        );
    }

    @PublicEndpoint
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