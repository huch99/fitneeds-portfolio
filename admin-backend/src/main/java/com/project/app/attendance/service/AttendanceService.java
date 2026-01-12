package com.project.app.attendance.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.attendance.dto.AttendanceScheduleDto;
import com.project.app.attendance.dto.ReservationDto;
import com.project.app.attendance.dto.ScheduleDetailDto;
import com.project.app.attendance.dto.SummaryDto;
import com.project.app.attendance.entity.AttendanceSchedule;
import com.project.app.attendance.entity.AttendanceStatus;
import com.project.app.attendance.entity.Reservation;
import com.project.app.attendance.repository.AttendanceScheduleRepository;
import com.project.app.attendance.repository.AttendanceScheduleView;
import com.project.app.attendance.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceScheduleRepository scheduleRepository;
    private final ReservationRepository reservationRepository;

 // 1️. 목록 조회
    public List<AttendanceScheduleDto> getMySchedules(String loginUserId) {

        List<AttendanceScheduleView> schedules =
                scheduleRepository.findByUserId(loginUserId);

        return schedules.stream()
                .map(AttendanceScheduleDto::from)
                .toList();
    }

    
 // 2️. 상세 조회
    public ScheduleDetailDto getScheduleDetail(Long schdId, String loginUserId) {

        AttendanceSchedule schedule =
                scheduleRepository.findById(schdId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("출석 스케줄이 없습니다.")
                        );

        // 강사 소유 검증
        if (!schedule.getUserId().equals(loginUserId)) {
            throw new AccessDeniedException("접근 권한 없음");
        }

        // 예약자 목록을 사용자 정보와 함께 조회
        List<ReservationDto> reservationDtos = 
                reservationRepository.findReservationDtosBySchdId(schdId);

        int total = reservationDtos.size();
        int attended = (int) reservationDtos.stream()
                .filter(r -> "ATTENDED".equals(r.getSttsCd()))
                .count();
        int absent = (int) reservationDtos.stream()
                .filter(r -> "ABSENT".equals(r.getSttsCd()))
                .count();

        return ScheduleDetailDto.of(        
        		SummaryDto.of(total, absent, attended),
                reservationDtos
        );
	}
    
    //3. 출석 상태 변경 서비스
    @Transactional
    public void updateAttendanceStatus(
            Long schdId,
            Long reservationId,
            AttendanceStatus status,
            String loginUserId
    ) {
        AttendanceSchedule schedule =
                scheduleRepository.findById(schdId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("출석 스케줄이 없습니다.")
                        );

        // 강사 소유 검증
        if (!schedule.getUserId().equals(loginUserId)) {
            throw new AccessDeniedException("접근 권한 없음");
        }

        Reservation reservation =
                reservationRepository.findById(reservationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("예약 정보가 없습니다.")
                        );

        // 같은 스케줄의 예약인지 검증
        if (!reservation.getSchdId().equals(schdId)) {
            throw new IllegalArgumentException("스케줄 불일치");
        }

        reservation.changeAttendanceStatus(status);
    }

}
