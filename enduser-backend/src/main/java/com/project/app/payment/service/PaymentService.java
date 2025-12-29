package com.project.app.payment.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.branch.repository.BranchRepository;
import com.project.app.payment.dto.PaymentRequestDto;
import com.project.app.payment.entity.Payment;
import com.project.app.payment.entity.PaymentPayMethod;
import com.project.app.payment.entity.PaymentPayTypeCd;
import com.project.app.payment.entity.PaymentSttsCd;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.service.ReservationService;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final UserRepository userRepository;
	private final UserPassService userPassService;
	private final ScheduleRepository scheduleRepository;
	private final BranchRepository branchRepository; 
	private final ReservationService reservationService;

	/**
     * 결제를 생성하고 처리하며, 결제 성공 시 예약을 생성합니다.
     *
     * @param requestDto 결제 요청 DTO
     * @return 생성된 Payment 엔티티 (결제 응답으로 사용)
     */
    public Payment createAndProcessPayment(PaymentRequestDto requestDto) {
        User user = userRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다: " + requestDto.getUserId()));
        
        Schedule schedule = scheduleRepository.findById(requestDto.getSchdId())
                .orElseThrow(() -> new NoSuchElementException("스케줄을 찾을 수 없습니다: " + requestDto.getSchdId()));
        
        // Huch의 Reservation 엔티티에는 Branch 필드가 직접 연결되어 있으므로,
        // Schedule 엔티티에서 Branch를 가져오거나, BranchRepository를 통해 Branch를 찾아야 합니다.
        // 여기서는 Schedule의 UserAdmin을 통해 Branch를 가져오는 것으로 가정합니다.
        Branch branch = schedule.getUserAdmin().getBranch(); // Schedule -> UserAdmin -> Branch 연결
        if (branch == null) {
            throw new NoSuchElementException("스케줄에 연결된 지점 정보를 찾을 수 없습니다.");
        }


        UserPass usedUserPass = null; // 이용권 사용 시 여기에 UserPass 엔티티를 저장
        // 1. PayMethod에 따른 이용권 사용 처리 (기존 로직 유지)
        if (requestDto.getPayMethod() == PaymentPayMethod.PASS) {
            if (requestDto.getUserPassId() == null) {
                throw new IllegalArgumentException("이용권 결제 시 userPassId는 필수입니다.");
            }
            // userPassService.usePassForR은 업데이트된 UserPass를 반환합니다.
            usedUserPass = userPassService.usePassForR(requestDto.getUserPassId(), "스케줄 예약(" + schedule.getSchdId() + ")");
            if (requestDto.getAmount() != 0) {
                 throw new IllegalArgumentException("이용권 결제 시 금액은 0원이어야 합니다.");
            }
        } else {
            // 다른 결제 수단 (CARD, REMITTANCE, POINT) 처리 로직
            if (requestDto.getAmount() <= 0) {
                throw new IllegalArgumentException("이용권 결제가 아닌 경우 결제 금액은 0보다 커야 합니다.");
            }
            // 실제 PG사 연동 로직 등이 여기에 들어갈 수 있습니다.
        }
        
        // 2. Payment 엔티티 생성 및 저장 (기존 로직 유지)
        Payment payment = Payment.builder()
                .user(user)
                .payTypeCd(PaymentPayTypeCd.SCHEDULE_RESERVATION)
                .payMethod(requestDto.getPayMethod())
                .payAmt(requestDto.getAmount())
                .sttsCd(PaymentSttsCd.PAID)
                .regDt(LocalDateTime.now())
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        // 3. 결제 완료 후 Reservation 엔티티 생성 및 저장 (Huch의 Reservation 엔티티에 맞춤)
        reservationService.createReservation(
            user,
            schedule,
            branch,         // Huch의 Reservation 엔티티에 Branch 필드 연결
            usedUserPass,   // Huch의 Reservation 엔티티에 UserPass 연결 (nullable)
            LocalDate.parse(requestDto.getReservationDate()), // YYYY-MM-DD String -> LocalDate
            LocalTime.parse(requestDto.getReservationTime())  // HH:MM String -> LocalTime
        );

        // 여기서는 결제 정보를 반환합니다. (예약 정보도 필요한 경우 새로운 DTO를 만들 수 있습니다.)
        return savedPayment;
    }
}
