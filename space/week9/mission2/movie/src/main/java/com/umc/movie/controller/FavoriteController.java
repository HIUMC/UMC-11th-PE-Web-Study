package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import static com.umc.movie.config.SwaggerConfig.BEARER_AUTH;
import com.umc.movie.dto.*;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@Tag(name = "Favorite")
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {
    private final FavoriteService service;
    @Operation(summary = "내 즐겨찾기 목록 조회", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 최신순 즐겨찾기 배열. 없으면 빈 배열"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @GetMapping
    public ApiResponse<List<FavoriteResponse>> list(@Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId) {
        return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", service.list(memberId));
    }
    @Operation(summary = "영화 즐겨찾기 여부 조회", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: isFavorite 반환. 등록하지 않은 영화는 false"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @GetMapping("/{movieId}")
    public ApiResponse<FavoriteStatusResponse> status(@Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @PathVariable Long movieId) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", new FavoriteStatusResponse(service.exists(memberId, movieId)));
    }
    @Operation(summary = "영화 즐겨찾기 등록", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 등록한 즐겨찾기 반환"),
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
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1: 즐겨찾기 중복; COMMON4091: DB 고유 제약 위반",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"FAVORITE409_1\", \"message\": \"즐겨찾기 중복\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(@Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("즐겨찾기에 추가했습니다.", service.create(memberId, request.movieId())));
    }
    @Operation(summary = "영화 즐겨찾기 해제", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 삭제 성공, result는 null"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1: 즐겨찾기를 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"FAVORITE404_1\", \"message\": \"즐겨찾기를 찾을 수 없음\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(@Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @PathVariable Long movieId) {
        service.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
