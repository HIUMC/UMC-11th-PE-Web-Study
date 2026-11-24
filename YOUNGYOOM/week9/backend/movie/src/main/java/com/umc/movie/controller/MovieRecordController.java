package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
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
// RatingController 클래스의 @RestController 바로 위에 추가
@Tag(name = "평점 즐겨찾기 트랜잭션", description = "평점 및 즐겨찾기 함께 등록")
public class MovieRecordController {
    private final MovieRecordService movieRecordService;

    //영화 평점과 선택한 즐겨찾기를 등록하는 API
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            //인증 인터셉터가 요청 속성에 저장한 로그인 회원 ID를 가져옴
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            //요청 JSON을 DTO로 반환하고 영화 ID, 별점, 즐겨찾기 추가 여부 검증
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        //서비스에서 평점을 저장하고, 요청에 따라 즐겨찾기도 추가함
        MovieRecordResponse response = movieRecordService.create(memberId, request);

        //저장 결과를 공통 응답 형식으로 감싸서 201 Created를 반환
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}
