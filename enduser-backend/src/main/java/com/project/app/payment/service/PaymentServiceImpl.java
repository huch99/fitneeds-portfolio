package com.project.app.payment.service;

import java.math.BigDecimal;
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

        // 사용자 기준으로 바로 조회
        List<Payment> payments = paymentRepository.findByUser_UserId(userId);

        log.info("결제 데이터 건수: {}", payments.size());

        return payments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private PaymentResponseDto convertToResponseDto(Payment payment) {
        // refId를 통해 Reservation 조회 (없을 수 있음)
        Reservation reservation = null;
        Schedule schedule = null;
        
        if (payment.getRefId() != null && "RESERVATION".equals(payment.getRefType())) {
            try {
                reservation = reservationRepository.findByReservationId(payment.getRefId()).orElse(null);
                if (reservation != null) {
                    schedule = reservation.getSchedule();
                }
            } catch (Exception e) {
                log.warn("예약 조회 실패: refId={}, error={}", payment.getRefId(), e.getMessage());
            }
        }

        String cancelRefundStatus = null;
        if (reservation != null && "CANCELLED".equals(reservation.getStatusCode())) {
            cancelRefundStatus = "취소완료";
        }

        return PaymentResponseDto.builder()
                .paymentId(payment.getPaymentId())
                .reservationId(payment.getRefId())
                .programName(
                        schedule != null ? schedule.getExerciseName() : null
                )
                .option(
                        schedule != null && schedule.getTrainerName() != null
                                ? "개인 레슨"
                                : "그룹 레슨"
                )
                .paymentAmount(BigDecimal.valueOf(payment.getPayAmount()))
                .paymentDate(payment.getRegistrationDateTime())
                .paymentStatus(payment.getStatusCode())
                .cancelRefundStatus(cancelRefundStatus)
                .build();
    }
}
