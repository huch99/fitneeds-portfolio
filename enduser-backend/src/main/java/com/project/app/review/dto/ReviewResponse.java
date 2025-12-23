package com.project.app.review.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private Long reservationId;
    private Integer rating;
    private String content;
    private Long instructorId;
    private LocalDateTime registrationDateTime;
}

