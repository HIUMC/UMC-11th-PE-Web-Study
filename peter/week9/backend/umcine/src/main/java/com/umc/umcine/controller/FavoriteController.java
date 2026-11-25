package com.umc.umcine.controller;

import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.dto.CreateFavoriteRequest;
import com.umc.umcine.dto.FavoriteResponse;
import com.umc.umcine.dto.FavoriteStatusResponse;
import com.umc.umcine.interceptor.AuthInterceptor;
import com.umc.umcine.service.FavoriteService;
import com.umc.umcine.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록", description = "JWT 토큰의 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201", description = "즐겨찾기 등록 성공",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                {"isSuccess":true,"code":"COMMON201","message":"즐겨찾기를 등록했습니다.","result":{"favoriteId":1,"movieId":550,"createdAt":"2026-11-24T16:00:00"}}
                """))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400", description = "영화 ID 누락 또는 양수가 아닌 값. COMMON4001",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                {"isSuccess":false,"code":"COMMON4001","message":"영화 ID는 필수입니다.","result":null}
                """))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                {"isSuccess":false,"code":"AUTH401_2","message":"로그인이 필요한 요청입니다.","result":null}
                """))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "MEMBER404_1 토큰에 해당하는 회원 없음",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                {"isSuccess":false,"code":"MEMBER404_1","message":"해당 회원을 찾을 수 없습니다.","result":null}
                """))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409", description = "FAVORITE409_1 이미 즐겨찾기한 영화",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                {"isSuccess":false,"code":"FAVORITE409_1","message":"이미 이 영화를 즐겨찾기하셨습니다.","result":null}
                """)))
    })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회", description = "JWT 인증이 필요합니다. 로그인한 회원의 즐겨찾기를 최신순으로 반환합니다. 없으면 빈 배열입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 목록 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰")
    })
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "JWT 인증이 필요합니다. 등록하지 않은 영화도 200과 isFavorite false를 반환합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 여부 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰")
    })
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제", description = "JWT 인증이 필요합니다. 로그인한 회원의 즐겨찾기를 해제합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 즐겨찾기 해제 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 즐겨찾기 없음")
    })
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
