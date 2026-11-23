package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

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
@RequestMapping(value = "/members", produces = "application/json")
public class MemberController {
    private final MemberService memberService;

    @PublicEndpoint
    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 확인", description = "공개 API. 닉네임 사용 가능 여부를 확인합니다.")
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
    @Operation(summary = "이메일 중복 확인", description = "공개 API. 이메일 사용 가능 여부를 확인합니다.")
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
    @Operation(summary = "내 정보 조회", description = "JWT에서 식별한 회원의 이메일·닉네임·가입일을 조회합니다.")
    public ApiResponse<MemberInfoResponse> getMyInfo(@Parameter(hidden = true) @LoginMember Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    @Operation(summary = "내 정보 수정", description = "JWT 회원의 닉네임을 수정합니다. 닉네임 중복은 409 MEMBER409_1입니다.")
    public ApiResponse<MemberInfoResponse> updateMyInfo(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody MemberUpdateRequest request
    ) {
        return ApiResponse.ok(
                "회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request)
        );
    }

    @PublicEndpoint
    @PostMapping
    @Operation(summary = "회원가입", description = "공개 API. 이메일·닉네임 중복과 비밀번호 형식을 검사합니다.")
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
