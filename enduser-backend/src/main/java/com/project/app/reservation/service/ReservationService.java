package com.project.app.reservation.service;

import java.util.List;

import com.project.app.reservation.dto.ReservationResponseDto;

public interface ReservationService {
	List<ReservationResponseDto> getMyReservations(String userId);
	
	/**
	 * 결제완료된 예약만 조회 (이용내역 화면용)
	 */
	List<ReservationResponseDto> getMyCompletedReservations(String userId);
	
	ReservationResponseDto getReservationById(Long reservationId);
	void cancelReservation(Long reservationId, String userId);
}

