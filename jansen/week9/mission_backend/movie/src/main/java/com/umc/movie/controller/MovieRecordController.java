package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.config.SwaggerExamples;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "영화 기록", description = "평점과 즐겨찾기를 한 번에 저장하는 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @Operation(
            summary = "영화 기록 저장 (평점 + 즐겨찾기)",
            description = """
                    평점과 즐겨찾기를 하나의 트랜잭션으로 저장합니다. 하나라도 실패하면 둘 다 저장되지 않습니다.
                    addToFavorites가 false면 평점만 저장하고, favorite은 null로 내려갑니다. 토큰이 필요합니다.
                    """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "저장 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "영화 기록을 저장했습니다.",
                              "result": {
                                "rating": { "ratingId": 1, "movieId": 550, "score": 5, "comment": "인생 영화",
                                            "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-13T21:00:00" },
                                "favorite": { "favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00" }
                              }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "별점은 1점 이상이어야 합니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.UNAUTHORIZED))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 평점을 남겼거나(RATING409_1) 이미 즐겨찾기한 영화(FAVORITE409_1)",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response = movieRecordService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}
