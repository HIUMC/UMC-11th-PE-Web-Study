package com.example.mission2.dto;

public record BookResponse(Long bookId, Long categoryId, String title, String description, Boolean isAvailable) {
}

