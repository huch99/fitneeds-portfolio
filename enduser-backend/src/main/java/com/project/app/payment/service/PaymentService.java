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
	@Transactional
	public Payment createAndProcessPayment(PaymentRequestDto requestDto) {
        User user = userRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다: " + requestDto.getUserId()));
        
        Schedule schedule = scheduleRepository.findById(requestDto.getSchdId())
                .orElseThrow(() -> new NoSuchElementException("스케줄을 찾을 수 없습니다: " + requestDto.getSchdId()));
        
        // Huch의 Reservation 엔티티에는 Branch 필드가 직접 연결되어 있으므로,
        // Schedule -> UserAdmin -> Branch 경로로 Branch를 가져옵니다.
        // 이 부분에서 NullPointerException 발생 가능성이 가장 높습니다.
        Branch branch = null;
        try {
            // schedule.getUserAdmin()이 null인지, 혹은 그 결과의 .getBranch()가 null인지 확인
            if (schedule.getUserAdmin() != null && schedule.getUserAdmin().getBranch() != null) {
                branch = schedule.getUserAdmin().getBranch();
            } else {
                // UserAdmin이 없거나 Branch 정보가 없는 경우.
                // 이 경우 어떤 오류 메시지를 줄지는 팀의 정책에 따릅니다.
                // 예를 들어, Schedule에 강사(UserAdmin)가 등록되어 있지 않거나, 강사에 지점 정보가 없는 경우.
                throw new NoSuchElementException("스케줄에 연결된 강사 또는 지점 정보가 유효하지 않습니다. 스케줄 ID: " + requestDto.getSchdId());
            }
        } catch (Exception e) { // 혹시 모를 다른 예외도 함께 catch
            throw new RuntimeException("스케줄에서 지점 정보를 가져오는 중 오류 발생. 스케줄 ID: " + requestDto.getSchdId() + ", 오류: " + e.getMessage(), e);
        }
        
        // --- 나머지 기존 코드 유지 ---
        UserPass usedUserPass = null; 
        // 1. PayMethod에 따른 이용권 사용 처리 (기존 로직 유지)
        if (requestDto.getPayMethod() == PaymentPayMethod.PASS) {
            if (requestDto.getUserPassId() == null) {
                throw new IllegalArgumentException("이용권 결제 시 userPassId는 필수입니다.");
            }
            usedUserPass = userPassService.usePassForR(requestDto.getUserPassId(), "스케줄 예약(" + schedule.getSchdId() + ")");
            if (requestDto.getAmount() != 0) {
                 throw new IllegalArgumentException("이용권 결제 시 금액은 0원이어야 합니다.");
            }
        } else {
            if (requestDto.getAmount() <= 0) {
                throw new IllegalArgumentException("이용권 결제가 아닌 경우 결제 금액은 0보다 커야 합니다.");
            }
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
        // 여기서 파라미터로 넘겨주는 LocalDate와 LocalTime이 파싱 문제로 실패할 수 있습니다.
        reservationService.createReservation(
            user,
            schedule,
            branch,         // 이제 null이 아님을 보장합니다.
            usedUserPass,   // null이 될 수 있음
            LocalDate.parse(requestDto.getReservationDate()),
            LocalTime.parse(requestDto.getReservationTime())
        );

        return savedPayment;
    }
}
