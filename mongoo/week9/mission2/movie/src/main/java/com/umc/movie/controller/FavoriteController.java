package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
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
@Tag(
        name = "즐겨찾기",
        description = "로그인한 회원의 영화 즐겨찾기 API"
)
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 등록",
            description = "토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다."
    )
    // 우리가 만든 공통 응답 DTO 이름도 ApiResponse라서, Swagger 쪽 애노테이션은 풀네임으로 적습니다.
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "즐겨찾기 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "즐겨찾기를 등록했습니다.",
                              "result": { "favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 즐겨찾기한 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response =
                favoriteService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "즐겨찾기를 등록했습니다.", response
                ));
    }

    @Operation(
            summary = "내 즐겨찾기 목록 조회",
            description = """
                로그인한 회원의 즐겨찾기 목록을 최신 등록 순서로 조회합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                즐겨찾기가 없으면 공통 응답의 result에 빈 배열을 반환합니다.
                """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 목록 조회 성공, 데이터가 없으면 result는 []"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            )
    })

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response =
                favoriteService.getMyFavorites(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response)
        );
    }

    @Operation(
            summary = "영화 즐겨찾기 여부 조회",
            description = """
                로그인한 회원이 해당 영화를 즐겨찾기했는지 조회합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                movieId는 즐겨찾기 ID가 아니라 TMDB 영화 ID입니다.
                등록한 영화는 isFavorite: true,
                등록하지 않은 영화는 isFavorite: false를 반환합니다.
                즐겨찾기하지 않은 상태도 정상 결과이므로 200을 반환합니다.
                """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 조회 성공, result.isFavorite에 여부 반환"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: movieId를 Long 타입으로 변환할 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            )
    })

    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response =
                favoriteService.getStatus(memberId, movieId);

        return ResponseEntity.ok(
                ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response)
        );
    }

    @Operation(
            summary = "즐겨찾기 해제",
            description = """
                로그인한 회원의 해당 영화 즐겨찾기를 해제합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                movieId는 즐겨찾기 ID가 아니라 TMDB 영화 ID입니다.
                성공 시 200과 공통 응답을 반환하며 result는 null입니다.
                해당 회원의 즐겨찾기가 없으면 404를 반환합니다.
                """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 즐겨찾기 해제 성공, result는 null"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: movieId를 Long 타입으로 변환할 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "FAVORITE404_1: 해당 회원의 즐겨찾기를 찾을 수 없음"
            )
    })

    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);

        return ResponseEntity.ok(
                ApiResponse.ok("즐겨찾기를 해제했습니다.", null)
        );
    }
}
