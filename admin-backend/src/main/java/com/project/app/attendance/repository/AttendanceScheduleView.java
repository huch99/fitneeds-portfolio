package com.project.app.attendance.repository;

import java.time.LocalDate;
import java.time.LocalTime;

//AttendanceScheduleRepository.findByUserId()에서 예약자 목록 조회
public interface AttendanceScheduleView {
    Long getSchdId();
    String getUserId();
    LocalDate getStrtDt();
    LocalTime getStrtTm();
    String getSttsCd();
}
