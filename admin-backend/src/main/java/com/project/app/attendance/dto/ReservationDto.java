package com.project.app.attendance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

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
    private final LocalDate rsvDt;
    private final LocalTime rsvTime;

    public static ReservationDto of(Long rsvId, String userId, String userName,
                                    String phoneNumber, String sttsCd,
                                    LocalDate rsvDt, LocalTime rsvTime) {
        return new ReservationDto(rsvId, userId, userName, phoneNumber, sttsCd, rsvDt, rsvTime);
    }

    public static ReservationDto from(Reservation reservation, String userName, String phoneNumber) {
        return new ReservationDto(
            reservation.getRsvId(),
            reservation.getUserId(),
            userName,
            phoneNumber,
            reservation.getSttsCd(),
            reservation.getRsvDt(),
            reservation.getRsvTime()
        );
    }
}


