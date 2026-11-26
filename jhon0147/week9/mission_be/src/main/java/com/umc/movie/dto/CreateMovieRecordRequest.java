package com.umc.movie.dto;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.*;

public record CreateMovieRecordRequest(
        @Schema(description = "TMDB 영화 ID, 양의 정수", example = "680")
        @NotNull(message = "영화 ID를 입력해주세요.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId,

        @Schema(description = "별점, 1~5의 정수", example = "5")
        @NotNull(message = "별점을 입력해주세요.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        Integer score,

        @Schema(description = "후기, 생략 가능, 최대 500자", example = "평점과 즐겨찾기를 함께 저장")
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
        String comment,

        @NotNull(message = "즐겨찾기 추가 여부를 입력해주세요.")
        @Schema(description = "즐겨찾기 동시 등록 여부. 필수. false면 기존 즐겨찾기는 유지", example = "true")
        Boolean addToFavorites
) {}
