package com.umc.movie.controller;

import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입과 내 정보 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "내 정보 조회",
            description = "토큰의 주인인 회원의 이메일, 닉네임, 가입 시각을 조회합니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "토큰의 회원이 탈퇴 등으로 존재하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.MEMBER404_1)))
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(
            summary = "내 정보 수정",
            description = "토큰의 주인인 회원의 닉네임을 수정합니다. 지금 쓰는 닉네임은 중복으로 보지 않습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "닉네임이 2자 미만이거나 12자 초과 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "다른 회원이 쓰고 있는 닉네임",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.MEMBER409_1)))
    })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }

    @Operation(
            summary = "닉네임 중복 확인",
            description = "회원가입 전에 닉네임을 쓸 수 있는지 확인합니다. available이 true면 사용할 수 있습니다. 토큰 없이 호출할 수 있는 공개 API입니다."
    )
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @Parameter(description = "확인할 닉네임", example = "영화조아") @PathVariable String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "회원가입 전에 이메일을 쓸 수 있는지 확인합니다. available이 true면 사용할 수 있습니다. 토큰 없이 호출할 수 있는 공개 API입니다."
    )
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(
            @Parameter(description = "확인할 이메일", example = "challenger@umc.com") @PathVariable String email
    ) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "이메일 형식, 비밀번호 규칙, 닉네임 길이를 지키지 않음 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 사용 중인 이메일 또는 닉네임",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.COMMON4092)))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
