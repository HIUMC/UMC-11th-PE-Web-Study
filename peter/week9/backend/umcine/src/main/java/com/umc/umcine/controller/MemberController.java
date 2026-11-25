package com.umc.umcine.controller;

import com.umc.umcine.dto.EmailCheckResponse;
import com.umc.umcine.dto.NicknameCheckResponse;
import com.umc.umcine.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.dto.MemberResponse;
import com.umc.umcine.dto.SignUpRequest;
import io.swagger.v3.oas.annotations.Operation;
import com.umc.umcine.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import com.umc.umcine.dto.MemberInfoResponse;
import com.umc.umcine.interceptor.AuthInterceptor;
import com.umc.umcine.dto.MemberUpdateRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입과 내 정보 API")
public class MemberController {

    private final MemberService memberService;
    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰 없이 호출하는 공개 API입니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "회원가입에 성공했습니다.",
                        response
                ));
    }

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(summary = "내 정보 조회", description = "JWT 인증이 필요합니다. 토큰에 해당하는 회원 정보를 조회합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 회원 정보 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 조회했습니다.", response)
        );
    }

    @Operation(summary = "내 정보 수정", description = "JWT 인증이 필요합니다. 로그인한 회원의 닉네임을 수정합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 회원 정보 수정 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 닉네임 중복")
    })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody MemberUpdateRequest request
    ) {
        MemberInfoResponse response =
                memberService.updateMyInfo(memberId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 수정했습니다.", response)
        );
    }

}