package com.project.app.attendance.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.project.app.attendance.entity.AttendanceSchedule;
import com.project.app.attendance.repository.AttendanceScheduleView;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AttendanceScheduleDto {

    private final Long schdId;
    private final String userId;
    private final LocalDate strtDt;
    private final LocalTime strtTm;
    private final String sttsCd;

    public static AttendanceScheduleDto from(AttendanceScheduleView view) {
        return new AttendanceScheduleDto(
                view.getSchdId(),
                view.getUserId(),
                view.getStrtDt(),
                view.getStrtTm(),
                view.getSttsCd()
        );
    }
}


