package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import static com.umc.movie.config.SwaggerConfig.BEARER_AUTH;

import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestAttribute;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Member")
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;

    @Operation(summary = "회원가입", description = "공개 API입니다. 토큰이 필요하지 않습니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 가입한 회원 정보 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "COMMON4092: 이메일/닉네임 중복; COMMON4091: DB 고유 제약 위반",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4092\", \"message\": \"이메일\", \"result\": null}")))
            })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(summary = "이메일 중복 여부 확인", description = "공개 API입니다. 토큰이 필요하지 않습니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "available 반환: 사용 가능하면 true")
            })
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(summary = "닉네임 중복 여부 확인", description = "공개 API입니다. 토큰이 필요하지 않습니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "available 반환: 사용 가능하면 true")
            })
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(summary = "내 정보 조회", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 로그인한 회원 정보 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1: 회원을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"회원을 찾을 수 없음\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            // 인터셉터가 request.setAttribute("memberId", ...)로 담아둔 값을 꺼냅니다
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 닉네임 수정", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 수정된 회원 정보 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1: 회원을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"회원을 찾을 수 없음\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1: 닉네임 중복; COMMON4091: DB 고유 제약 위반",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER409_1\", \"message\": \"닉네임 중복\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}