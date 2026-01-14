package com.project.app.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long rsvId;
    private String userId;
    private String userName;
    private String phoneNumber;
    private String sttsCd;
    private String rsvDt;
    private String rsvTime;
}

