package com.project.app.reservation.mapper;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.reservation.entity.Reservation;
import com.project.app.user.entity.User;

@Repository
public interface ReservationMapper extends JpaRepository<Reservation, Long> {
	// User로 조회
	List<Reservation> findByUser(User user);
	
	// User ID로 조회 (usr_id 컬럼 사용)
	List<Reservation> findByUser_UserId(String userId);
	
	// 예약 ID로 조회 (rsv_id 컬럼 사용)
	Optional<Reservation> findByReservationId(Long reservationId);
	
	// Schedule ID로 조회 (schd_id 컬럼 사용)
	List<Reservation> findBySchedule_ScheduleId(Long scheduleId);
	
	// Ticket ID로 조회 (tkt_id 컬럼 사용)
	List<Reservation> findByTicket_TicketId(Long ticketId);
}

