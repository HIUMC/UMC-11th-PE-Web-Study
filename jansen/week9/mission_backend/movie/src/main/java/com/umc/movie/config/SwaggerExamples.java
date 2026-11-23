package com.umc.movie.config;

// 여러 API에서 똑같이 쓰는 실패 응답 예시를 한곳에 모아둡니다.
// 어노테이션 값에는 상수만 쓸 수 있어서 static final String으로 둡니다.
public final class SwaggerExamples {

    private SwaggerExamples() {
    }

    public static final String UNAUTHORIZED = """
            {
              "isSuccess": false,
              "code": "AUTH401_2",
              "message": "로그인이 필요한 요청입니다.",
              "result": null
            }
            """;

    public static final String MEMBER_NOT_FOUND = """
            {
              "isSuccess": false,
              "code": "MEMBER404_1",
              "message": "해당 회원을 찾을 수 없습니다.",
              "result": null
            }
            """;
}
