package com.umc.umcine.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class UpdateRatingRequest {
    @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
    @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
    private Integer score;

    @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
    private String comment;
    private boolean scorePresent;
    private boolean commentPresent;

    @JsonSetter("score")
    public void setScore(Integer score) { this.score = score; this.scorePresent = true; }

    @JsonSetter("comment")
    public void setComment(String comment) { this.comment = comment; this.commentPresent = true; }

    public Integer score() { return score; }
    public String comment() { return comment; }
    public boolean hasScore() { return scorePresent; }
    public boolean hasComment() { return commentPresent; }

    @JsonIgnore
    @AssertTrue(message = "수정할 별점 또는 후기를 입력해주세요.")
    public boolean isAnyFieldPresent() { return scorePresent || commentPresent; }

    @JsonIgnore
    @AssertTrue(message = "별점은 null일 수 없습니다.")
    public boolean isScoreValid() { return !scorePresent || score != null; }
}
