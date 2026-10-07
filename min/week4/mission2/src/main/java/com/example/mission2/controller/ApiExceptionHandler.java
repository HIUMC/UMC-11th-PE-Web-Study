package com.example.mission2.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResponse handleNotFound(IllegalArgumentException e) { return new ErrorResponse(e.getMessage()); }

    public record ErrorResponse(String message) { }
}
