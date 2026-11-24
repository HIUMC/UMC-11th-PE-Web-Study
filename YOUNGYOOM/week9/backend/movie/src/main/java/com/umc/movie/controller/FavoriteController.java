// src/main/java/com/umc/movie/controller/FavoriteController.java
package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.favorite.CreateFavoriteRequest;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.dto.favorite.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class FavoriteController {
    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 등록",
            description = "토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다."
    )
    //우리가 만든 공통 응답 DTO 이름도 ApiResponse라서, 스웨거쪽 애노테이션은 풀네임으로 작성
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "즐겨찾기 등록 성공",
                    content = @Content(mediaType = "application/json", examples
                            = @ExampleObject(value = """
                            {
                            "isSuccess" : true,
                            "code" : "COMMON201",
                            "message":"즐겨찾기를 등록했습니다.",
                            "result":{ "favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00" }                                                    
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples
                            = @ExampleObject(value = """
                            {
                            "isSuccess": false,
                            "code": "AUTH401_2",
                            "message": "로그인이 필요한 요청입니다.",
                            "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 이 영화를 즐겨찾기함 (FAVORITE409_1)")
    })
    //영화를 즐겨찾기 등록
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            //인증 인터셉터가 요청 속성에 넣어 둔 로그인 회원 ID를 가져옴
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            //요청 본문을 DTO로 반환하고, 영화 ID가 필수이며 양수인지 검증
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);

        //등록한 항목의 정보와 함께 201 Created 반환
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    //로그인한 회원의 즐겨찾기 목록 조회
    @Operation(
            summary = "내 즐겨찾기 조회",
            description = "내가 즐겨찾기한 영화 목록을 조회합니다. Bearer 토큰이 필요합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "내 즐겨찾기 목록 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)")
    })
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    //특정 영화의 즐겨찾기 여부 조회
    @Operation(
            summary = "즐겨찾기 여부 조회",
            description = "해당 영화를 내가 즐겨찾기했는지 조회합니다. Bearer 토큰이 필요합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "즐겨찾기 여부 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)")
    })
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId //URL 경로에서 TMDB 영화 ID를 가져옴
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }


    //로그인한 회원의 즐겨찾기에서 URL에 지정한 영화 제거
    @Operation(
            summary = "즐겨찾기 해제",
            description = "해당 영화를 내 즐겨찾기 목록에서 해제합니다. Bearer 토큰이 필요합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "즐겨찾기 해제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "즐겨찾기를 찾을 수 없음 (FAVORITE404_1)")
    })
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        //해제 성공시 성공 메시지 + 200 OK 반환
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다", null));
    }

}
