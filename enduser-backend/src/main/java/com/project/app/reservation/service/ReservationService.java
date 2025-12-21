package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.project.app.reservation.dto.ReservationResponseDto;

public interface ReservationService {
	/**
	 * 나의 예약 목록 조회 (예약목록 화면용)
	 * 결제완료되었고 예약일자가 아직 지나지 않은 예약들
	 */
	List<ReservationResponseDto> getMyReservations(String userId);
	
	/**
	 * 결제완료된 예약만 조회 (이용내역 화면용)
	 * 예약일자가 지난 예약들
	 */
	List<ReservationResponseDto> getMyCompletedReservations(String userId);
	
	/**
	 * 예약일자 변경
	 * @param reservationId 예약 ID
	 * @param userId 사용자 ID
	 * @param newReservedDate 새로운 예약날짜
	 * @param newReservedTime 새로운 예약시간
	 */
	void updateReservationDate(Long reservationId, String userId, LocalDate newReservedDate, LocalTime newReservedTime);
	
	ReservationResponseDto getReservationById(Long reservationId);
	void cancelReservation(Long reservationId, String userId);
}

