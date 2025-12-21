package com.project.app.reservation.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
		// 결제완료된 결제 목록 조회 (실제 테이블의 stts_cd = 'COMPLETED' 사용)
		List<Payment> completedPayments = paymentRepository.findByUser_UserIdAndStatusCode(userId, "COMPLETED");
		
		// 예약일자가 아직 지나지 않은 예약만 필터링 (예약목록)
		LocalDateTime now = LocalDateTime.now();
		return completedPayments.stream()
				.map(Payment::getReservation)
				.filter(reservation -> {
					// 예약일자가 오늘 이후인 경우만 (예약목록에 표시)
					LocalDateTime reservedDateTime = reservation.getReservedDate();
					if (reservation.getReservedTime() != null) {
						// reservedTime이 있으면 날짜와 시간을 결합
						reservedDateTime = LocalDateTime.of(
								reservation.getReservedDate().toLocalDate(),
								reservation.getReservedTime()
						);
					}
					// 예약일자가 현재 시간 이후인 경우만 (아직 이용하지 않은 예약)
					return reservedDateTime != null && reservedDateTime.isAfter(now);
				})
				.map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}
	
	@Override
	public List<ReservationResponseDto> getMyCompletedReservations(String userId) {
		// 입금완료된 결제 목록 조회 (실제 테이블의 stts_cd = 'COMPLETED' 사용)
		List<Payment> completedPayments = paymentRepository.findByUser_UserIdAndStatusCode(userId, "COMPLETED");
		
		// 예약일자가 지난 예약만 필터링 (이용목록)
		LocalDateTime now = LocalDateTime.now();
		return completedPayments.stream()
				.map(Payment::getReservation)
				.filter(reservation -> {
					// 예약일자가 오늘 이전이거나 오늘인 경우 (이용목록에 표시)
					LocalDateTime reservedDateTime = reservation.getReservedDate();
					if (reservation.getReservedTime() != null) {
						// reservedTime이 있으면 날짜와 시간을 결합
						reservedDateTime = LocalDateTime.of(
								reservation.getReservedDate().toLocalDate(),
								reservation.getReservedTime()
						);
					}
					// 예약일자가 현재 시간 이전이거나 같은 경우 (이미 이용한 예약)
					return reservedDateTime != null && (reservedDateTime.isBefore(now) || reservedDateTime.isEqual(now));
				})
				.map(this::convertToResponseDto)
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
	public void updateReservationDate(Long reservationId, String userId, LocalDate newReservedDate, LocalTime newReservedTime) {
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		// 권한 체크: 본인의 예약인지 확인
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("예약을 변경할 권한이 없습니다.");
		}
		
		// 결제완료된 예약인지 확인 (ref_id로 조회)
		Payment payment = paymentRepository.findByRefId(reservation.getReservationId())
				.orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
		
		// 실제 테이블의 stts_cd 확인
		if (!"COMPLETED".equals(payment.getStatusCode())) {
			throw new RuntimeException("결제완료된 예약만 변경할 수 있습니다.");
		}
		
		// 예약일자가 이미 지난 경우 변경 불가
		LocalDateTime currentReservedDateTime = reservation.getReservedDate();
		if (reservation.getReservedTime() != null) {
			currentReservedDateTime = LocalDateTime.of(
					reservation.getReservedDate().toLocalDate(),
					reservation.getReservedTime()
			);
		}
		
		if (currentReservedDateTime.isBefore(LocalDateTime.now())) {
			throw new RuntimeException("이미 지난 예약일자는 변경할 수 없습니다.");
		}
		
		// 예약일자/시간 변경
		reservation.setReservedDate(LocalDateTime.of(newReservedDate, newReservedTime != null ? newReservedTime : LocalTime.of(0, 0)));
		reservation.setReservedTime(newReservedTime);
		reservation.setModifyUserId(userId);
		
		reservationRepository.save(reservation);
		log.info("예약일자 변경 완료: 예약ID={}, 사용자ID={}, 새로운 예약일자={}, 새로운 예약시간={}", 
				reservationId, userId, newReservedDate, newReservedTime);
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
		
		// 결제 정보 조회 (ref_id로 조회)
		Payment payment = paymentRepository.findByRefId(reservation.getReservationId()).orElse(null);
		String paymentStatus = payment != null ? payment.getPaymentStatus() : null;
		BigDecimal paymentAmount = payment != null ? payment.getPaymentAmount() : null;
		
		// 예약날짜/시간 추출
		LocalDate reservedDate = reservation.getReservedDate() != null 
				? reservation.getReservedDate().toLocalDate() 
				: null;
		LocalTime reservedTime = reservation.getReservedTime();
		
		return ReservationResponseDto.builder()
				.reservationId(reservation.getReservationId())
				.exerciseName(schedule != null ? schedule.getExerciseName() : null)
				.exerciseDate(schedule != null ? schedule.getExerciseDate() : null)
				.exerciseLocation(schedule != null ? schedule.getExerciseLocation() : null)
				.trainerName(schedule != null ? schedule.getTrainerName() : null)
				.paymentStatus(paymentStatus)
				// 예약목록용 필드
				.reservedDate(reservedDate)
				.reservedTime(reservedTime)
				.programId(schedule != null && schedule.getProgram() != null ? schedule.getProgram().getProgramId() : null)
				.programName(schedule != null ? schedule.getExerciseName() : null)
				.paymentAmount(paymentAmount)
				// 이용목록용 필드
				.branchName(schedule != null ? schedule.getExerciseLocation() : null)
				.build();
	}
}

