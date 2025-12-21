package com.project.app.payment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.app.payment.dto.PaymentResponseDto;
import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {
	
	private final PaymentRepository paymentRepository;
	private final ReservationRepository reservationRepository;
	
	public PaymentServiceImpl(
			PaymentRepository paymentRepository,
			ReservationRepository reservationRepository) {
		this.paymentRepository = paymentRepository;
		this.reservationRepository = reservationRepository;
	}
	
	@Override
	public List<PaymentResponseDto> getMyPayments(String userId) {
		log.info("결제내역 조회 시작: userId={}", userId);
		
		// 간단하게: 전체 데이터 조회 후 필터링 (User 엔티티 함께 로드)
		List<Payment> allPayments = paymentRepository.findAllWithUser();
		log.info("전체 결제 데이터 건수: {}", allPayments.size());
		
		// userId로 필터링
		List<Payment> payments = allPayments.stream()
				.filter(p -> p.getUser() != null && userId.equals(p.getUser().getUserId()))
				.collect(Collectors.toList());
		
		log.info("필터링 결과: userId={}, 건수={}", userId, payments.size());
		
		return payments.stream()
				.map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}
	
	private PaymentResponseDto convertToResponseDto(Payment payment) {
		log.debug("결제 DTO 변환 시작: paymentId={}, refId={}, payTypeCd={}", 
				payment.getPaymentId(), payment.getRefId(), payment.getPayTypeCd());
		
		// ref_id를 통해 예약 정보 조회
		Reservation reservation = null;
		Schedule schedule = null;
		
		if (payment.getRefId() != null && "RESERVATION".equals(payment.getPayTypeCd())) {
			// ref_id가 예약 ID인 경우 예약 정보 조회
			try {
				reservation = reservationRepository.findByReservationId(payment.getRefId()).orElse(null);
				if (reservation != null) {
					schedule = reservation.getSchedule();
					log.debug("예약 정보 조회 성공: reservationId={}, schedule={}", 
							reservation.getReservationId(), schedule != null ? schedule.getScheduleId() : null);
				} else {
					log.warn("예약 정보를 찾을 수 없습니다: refId={}", payment.getRefId());
				}
			} catch (Exception e) {
				log.error("예약 정보 조회 실패: refId={}, error={}", payment.getRefId(), e.getMessage(), e);
			}
		} else {
			log.debug("예약 정보 조회 건너뜀: refId={}, payTypeCd={}", payment.getRefId(), payment.getPayTypeCd());
		}
		
		// 취소/환불 상태 확인
		String cancelRefundStatus = null;
		if (reservation != null) {
			if ("CANCELLED".equals(reservation.getStatusCode())) {
				cancelRefundStatus = "취소완료";
			}
			// 환불 상태는 별도 로직이 필요할 수 있음
		}
		
		PaymentResponseDto dto = PaymentResponseDto.builder()
				.paymentId(payment.getPaymentId())
				.reservationId(payment.getRefId()) // ref_id가 예약 ID
				.programName(schedule != null ? schedule.getExerciseName() : null)
				.option(schedule != null && schedule.getTrainerName() != null ? "개인 레슨" : "그룹 레슨")
				.paymentAmount(payment.getPaymentAmount()) // 편의 메서드 사용
				.paymentDate(payment.getPaymentDate()) // 편의 메서드 사용
				.paymentStatus(payment.getPaymentStatus()) // 편의 메서드 사용
				.cancelRefundStatus(cancelRefundStatus)
				.build();
		
		log.debug("결제 DTO 변환 완료: paymentId={}, programName={}", dto.getPaymentId(), dto.getProgramName());
		
		return dto;
	}
}

