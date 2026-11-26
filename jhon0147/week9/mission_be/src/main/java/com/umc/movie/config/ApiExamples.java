package com.umc.movie.config;

// Swagger에 표시할 공통 실패 응답 예시
public final class ApiExamples {
    private ApiExamples() {}

    public static final String BAD_REQUEST = """
            {"isSuccess":false,"code":"COMMON4001","message":"입력값을 확인해주세요.","result":null}
            """;
    public static final String LOGIN_FAILED = """
            {"isSuccess":false,"code":"AUTH401_1","message":"이메일 또는 비밀번호가 올바르지 않습니다.","result":null}
            """;
    public static final String UNAUTHORIZED = """
            {"isSuccess":false,"code":"AUTH401_2","message":"로그인이 필요한 요청입니다.","result":null}
            """;
    public static final String INVALID_TOKEN = """
            {"isSuccess":false,"code":"AUTH401_3","message":"유효하지 않은 토큰입니다.","result":null}
            """;
    public static final String EXPIRED_TOKEN = """
            {"isSuccess":false,"code":"AUTH401_4","message":"토큰이 만료되었습니다. 다시 로그인해주세요.","result":null}
            """;
    public static final String MEMBER_NOT_FOUND = """
            {"isSuccess":false,"code":"MEMBER404_1","message":"해당 회원을 찾을 수 없습니다.","result":null}
            """;
    public static final String NICKNAME_CONFLICT = """
            {"isSuccess":false,"code":"MEMBER409_1","message":"이미 사용 중인 닉네임입니다.","result":null}
            """;
    public static final String EMAIL_CONFLICT = """
            {"isSuccess":false,"code":"MEMBER409_2","message":"이미 사용 중인 이메일입니다.","result":null}
            """;
    public static final String FAVORITE_CONFLICT = """
            {"isSuccess":false,"code":"FAVORITE409_1","message":"이미 이 영화를 즐겨찾기하셨습니다.","result":null}
            """;
    public static final String FAVORITE_NOT_FOUND = """
            {"isSuccess":false,"code":"FAVORITE404_1","message":"즐겨찾기한 영화를 찾을 수 없습니다.","result":null}
            """;
    public static final String RATING_CONFLICT = """
            {"isSuccess":false,"code":"RATING409_1","message":"이미 이 영화에 평점을 남기셨습니다.","result":null}
            """;
    public static final String RATING_FORBIDDEN = """
            {"isSuccess":false,"code":"RATING403_1","message":"본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.","result":null}
            """;
    public static final String RATING_NOT_FOUND = """
            {"isSuccess":false,"code":"RATING404_1","message":"해당 평점을 찾을 수 없습니다.","result":null}
            """;
}
