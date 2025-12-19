package com.project.app.attendance.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.attendance.entity.Attendance;
import com.project.app.user.entity.User;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	// User ID로 출석 목록 조회
	List<Attendance> findByUser_UserId(String userId);
	
	// 예약 ID로 출석 조회
	Optional<Attendance> findByReservation_ReservationId(Long reservationId);
	
	// 이용권 ID로 출석 목록 조회
	List<Attendance> findByTicket_TicketId(Long ticketId);
	
	// 출석일로 조회
	List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
	
	// 사용자 ID와 출석일로 조회
	List<Attendance> findByUser_UserIdAndAttendanceDate(String userId, LocalDate attendanceDate);
	
	// 사용자 ID와 출석상태로 조회
	List<Attendance> findByUser_UserIdAndAttendanceStatusCode(String userId, String attendanceStatusCode);
	
	// 주간 출석 조회 (시작일부터 7일간)
	@Query("SELECT a FROM Attendance a WHERE a.user.userId = :userId AND a.attendanceDate >= :startDate AND a.attendanceDate < :endDate")
	List<Attendance> findByUser_UserIdAndAttendanceDateBetween(
			@Param("userId") String userId, 
			@Param("startDate") LocalDate startDate, 
			@Param("endDate") LocalDate endDate);
	
	// 월간 출석 조회
	@Query("SELECT a FROM Attendance a WHERE a.user.userId = :userId AND YEAR(a.attendanceDate) = :year AND MONTH(a.attendanceDate) = :month")
	List<Attendance> findByUser_UserIdAndYearAndMonth(
			@Param("userId") String userId, 
			@Param("year") int year, 
			@Param("month") int month);
}

