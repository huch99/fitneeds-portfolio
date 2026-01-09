package com.project.app.review.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ReservationReviewDto {

    private Long reservationId;
    private LocalDate exerciseDate;

    private String productName;
    private String teacherName;
    private String facilityName;

    private Integer rating;
    private String content;

    private LocalDateTime registrationDateTime;
}