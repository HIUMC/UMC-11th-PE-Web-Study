package com.umc.umcine.dto;

public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}
