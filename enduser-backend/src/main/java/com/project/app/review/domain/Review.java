package com.project.app.review.domain;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Review {

    private Long reviewId;
    private Long reservationId;
    private Integer rating;
    private String content;
    private String userId;
    private Long instructorId;
    private Boolean deleted;
    private LocalDateTime registrationDateTime;
}

