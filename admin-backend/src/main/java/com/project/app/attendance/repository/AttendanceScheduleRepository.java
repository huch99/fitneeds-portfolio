package com.project.app.attendance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.attendance.entity.AttendanceSchedule;

// AttendanceService.getMySchedules()에서 스케줄 목록 조회

@Repository
public interface AttendanceScheduleRepository
        extends JpaRepository<AttendanceSchedule, Long> {

    @Query("""
        SELECT
            s.schdId AS schdId,
            s.userId AS userId,
            s.strtDt AS strtDt,
            s.strtTm AS strtTm,
            s.sttsCd AS sttsCd
        FROM AttendanceSchedule s
        WHERE s.userId = :userId
        AND s.sttsCd = 'ACTIVE'
        ORDER BY s.strtDt, s.strtTm
    """)
    List<AttendanceScheduleView> findByUserId(
            @Param("userId") String userId
    );
}


