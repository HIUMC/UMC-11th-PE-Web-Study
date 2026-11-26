package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Documentation schema matching ApiResponse.failure; runtime responses stay unchanged. */
@Schema(description = "공통 실패 응답")
public record ErrorResponse(
        @Schema(example = "false") boolean isSuccess,
        @Schema(example = "RATING409_1") String code,
        @Schema(example = "이미 이 영화에 평점을 남기셨습니다.") String message,
        @Schema(nullable = true, description = "실패 응답은 항상 null") Void result
) {}
