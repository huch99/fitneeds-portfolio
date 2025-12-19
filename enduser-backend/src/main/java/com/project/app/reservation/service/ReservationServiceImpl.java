package com.project.app.reservation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.dto.ReservationResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReservationServiceImpl implements ReservationService {
	
	private final ReservationRepository reservationRepository;
	private final PaymentRepository paymentRepository;
	
	public ReservationServiceImpl(
			ReservationRepository reservationRepository,
			PaymentRepository paymentRepository) {
		this.reservationRepository = reservationRepository;
		this.paymentRepository = paymentRepository;
	}
	
	@Override
	public List<ReservationResponseDto> getMyReservations(String userId) {
		List<Reservation> reservations = reservationRepository.findByUser_UserId(userId);
		return reservations.stream()
				.map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}
	
	@Override
	public List<ReservationResponseDto> getMyCompletedReservations(String userId) {
		// 입금완료된 결제 목록 조회 (이용목록)
		List<Payment> completedPayments = paymentRepository.findByUser_UserIdAndPaymentStatus(userId, "BANK_TRANSFER_COMPLETED");
		
		// 결제에 연결된 예약만 필터링하여 반환
		return completedPayments.stream()
				.map(payment -> convertToResponseDto(payment.getReservation()))
				.collect(Collectors.toList());
	}
	
	@Override
	public ReservationResponseDto getReservationById(Long reservationId) {
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		return convertToResponseDto(reservation);
	}
	
	@Override
	@Transactional
	public void cancelReservation(Long reservationId, String userId) {
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("예약을 취소할 권한이 없습니다.");
		}
		
		reservation.setStatusCode("CANCELLED");
		reservation.setModifyUserId(userId); // 취소한 사용자 ID 저장
		reservationRepository.save(reservation);
	}
	
	/**
	 * 예약 취소 (취소사유 포함)
	 */
	@Transactional
	public void cancelReservationWithReason(Long reservationId, String userId, String cancelReason) {
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("예약을 취소할 권한이 없습니다.");
		}
		
		reservation.setStatusCode("CANCELLED");
		reservation.setCancelReason(cancelReason);
		reservation.setModifyUserId(userId);
		reservationRepository.save(reservation);
	}
	
	private ReservationResponseDto convertToResponseDto(Reservation reservation) {
		Schedule schedule = reservation.getSchedule();
		
		// 결제 상태 조회
		String paymentStatus = null;
		Payment payment = paymentRepository.findByReservation(reservation).orElse(null);
		if (payment != null) {
			paymentStatus = payment.getPaymentStatus();
		}
		
		return ReservationResponseDto.builder()
				.reservationId(reservation.getReservationId())
				.exerciseName(schedule != null ? schedule.getExerciseName() : null)
				.exerciseDate(schedule != null ? schedule.getExerciseDate() : null)
				.exerciseLocation(schedule != null ? schedule.getExerciseLocation() : null)
				.trainerName(schedule != null ? schedule.getTrainerName() : null)
				.paymentStatus(paymentStatus)
				.build();
	}
}

