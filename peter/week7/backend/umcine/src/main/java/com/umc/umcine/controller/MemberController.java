package com.umc.umcine.controller;

import com.umc.umcine.dto.EmailCheckResponse;
import com.umc.umcine.dto.NicknameCheckResponse;
import com.umc.umcine.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.dto.MemberResponse;
import com.umc.umcine.dto.SignUpRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import com.umc.umcine.dto.MemberInfoResponse;
import com.umc.umcine.interceptor.AuthInterceptor;
import com.umc.umcine.dto.MemberUpdateRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
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

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 조회했습니다.", response)
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody MemberUpdateRequest request
    ) {
        MemberInfoResponse response =
                memberService.updateMyInfo(memberId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 수정했습니다.", response)
        );
    }

}