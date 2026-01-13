package com.project.app.attendance.dto;

import java.time.LocalDateTime;

import com.project.app.attendance.entity.Reservation;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReservationDto {

    private final Long rsvId;
    private final String userId;
    private final String userName;
    private final String phoneNumber;
    private final String sttsCd;
    private final String rsvDt;
    private final String rsvTime;

    // Repository에서 직접 조인해서 가져온 데이터로 생성
    public static ReservationDto of(Long rsvId, String userId, String userName, 
                                   String phoneNumber, String sttsCd, 
                                   String rsvDt, String rsvTime) {
        return new ReservationDto(rsvId, userId, userName, phoneNumber, 
                                 sttsCd, rsvDt, rsvTime);
    }
}

