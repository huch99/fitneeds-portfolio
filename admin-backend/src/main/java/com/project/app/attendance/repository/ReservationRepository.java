package com.project.app.attendance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.app.attendance.dto.ReservationDto;
import com.project.app.attendance.entity.Reservation;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    // 예약 목록과 사용자 정보를 직접 조인해서 DTO로 반환
    @Query("SELECT new com.project.app.attendance.dto.ReservationDto(" +
           "r.rsvId, r.userId, u.userName, u.phoneNumber, " +
           "r.sttsCd, CAST(r.rsvDt AS string), CAST(r.rsvTime AS string)) " +
           "FROM Reservation r " +
           "JOIN User u ON r.userId = u.userId " +
           "WHERE r.schdId = :schdId")
    List<ReservationDto> findReservationDtosBySchdId(@Param("schdId") Long schdId);

    // 기존 메서드 유지
    List<Reservation> findBySchdId(Long schdId);
}

