package com.umc.movie.controller;
import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "즐겨찾기", description = "인증된 회원의 영화 즐겨찾기")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
@ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        }))
})
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록", description = "인증 필요. 같은 회원은 같은 영화를 한 번만 등록할 수 있습니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 같은 회원·영화 중복",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "즐겨찾기 중복", value = ApiExamples.FAVORITE_CONFLICT)
                        }))
    })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(
                ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
    }

    @Operation(summary = "내 즐겨찾기 목록", description = "인증 필요. 최신 등록순 목록이며 등록한 영화가 없으면 빈 배열입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 성공")
    })
    @GetMapping("/favorites")
    public ApiResponse<List<FavoriteResponse>> getMyFavorites(@Parameter(hidden = true) @LoginMember Long memberId) {
        return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "인증 필요. 등록하지 않은 영화도 200이며 isFavorite은 false입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 여부 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        }))
    })
    @GetMapping("/favorites/{movieId}")
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @Parameter(hidden = true) @LoginMember Long memberId, @Positive @PathVariable Long movieId) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @Operation(summary = "즐겨찾기 해제", description = "인증 필요. URL에는 즐겨찾기 번호가 아닌 TMDB 영화 ID를 입력합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 해제 성공, result는 null"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 내 즐겨찾기에 없는 영화",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "즐겨찾기 없음", value = ApiExamples.FAVORITE_NOT_FOUND)
                        }))
    })
    @DeleteMapping("/favorites/{movieId}")
    public ApiResponse<Void> delete(
            @Parameter(hidden = true) @LoginMember Long memberId, @Positive @PathVariable Long movieId) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
