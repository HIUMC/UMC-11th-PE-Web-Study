package com.umc.movie.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
public record CreateFavoriteRequest(@NotNull @Positive Long movieId) {}
