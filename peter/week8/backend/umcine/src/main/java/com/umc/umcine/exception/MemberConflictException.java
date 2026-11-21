package com.umc.umcine.exception;

public class MemberConflictException extends ApiException {
    private MemberConflictException(MemberErrorCode errorCode) {
        super(errorCode);
    }

    public static MemberConflictException duplicateEmail() {
        return new MemberConflictException(MemberErrorCode.DUPLICATE_EMAIL);
    }

    public static MemberConflictException duplicateNickname() {
        return new MemberConflictException(MemberErrorCode.DUPLICATE_NICKNAME);
    }
}
