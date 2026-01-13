package com.project.app.attendance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.attendance.dto.AttendanceScheduleDto;
import com.project.app.attendance.dto.AttendanceUpdateRequest;
import com.project.app.attendance.dto.ScheduleDetailDto;
import com.project.app.attendance.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 1️ 출석 관리 스케줄 목록
    @GetMapping
    public ResponseEntity<List<AttendanceScheduleDto>> getMySchedules(
            @AuthenticationPrincipal String loginUserId
    ) {
        return ResponseEntity.ok(
                attendanceService.getMySchedules(loginUserId)
//        		 attendanceService.getMySchedules("inst-001")
        );
    }
    
 // 2️ 특정 스케줄 출석 상세 조회 - 해당 수업의 예약자 출결현황
    @GetMapping("/{schdId}")
    public ResponseEntity<ScheduleDetailDto> getScheduleDetail(
            @PathVariable("schdId") Long schdId,
             @AuthenticationPrincipal String loginUserId
    ) {
        return ResponseEntity.ok(
              attendanceService.getScheduleDetail(schdId, loginUserId)
            //attendanceService.getScheduleDetail(schdId, "inst-001")             
        );
    }
    
  // 3 출석 상태 변경  
    @PatchMapping("/{schdId}/reservations/{reservationId}")
    public ResponseEntity<Void> updateAttendance(
            @PathVariable Long schdId,
            @PathVariable Long reservationId,
            @RequestBody AttendanceUpdateRequest dto,
            @AuthenticationPrincipal String loginUserId
    ) {
        attendanceService.updateAttendanceStatus(
                schdId,
                reservationId,
                dto.getStatus(),
                loginUserId
        );
        return ResponseEntity.ok().build();
    }
}