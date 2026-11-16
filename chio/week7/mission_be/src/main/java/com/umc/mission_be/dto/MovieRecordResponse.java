package com.umc.mission_be.dto;



public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}