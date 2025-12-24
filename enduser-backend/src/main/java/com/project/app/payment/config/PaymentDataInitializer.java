package com.project.app.payment.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class PaymentDataInitializer {

	private final PaymentRepository paymentRepository;
	private final UserRepository userRepository;

	@Bean
	public CommandLineRunner initPaymentData() {
		return args -> {
			log.info("========== 결제 가데이터 초기화 시작 ==========");
			
			// 특정 userId로 사용자 조회
			String targetUserId = "a4b502adb0df4f7ca9f9ef2879ac1dab";
			
			log.info("대상 userId: {}", targetUserId);
			
			// 해당 userId에 대한 결제가 이미 있는지 확인
			List<Payment> existingPayments = paymentRepository.findByUserUserIdOrderByRegDtDesc(targetUserId);
			if (!existingPayments.isEmpty()) {
				log.info("사용자 {}에 대한 결제 데이터가 이미 존재합니다. ({}건) 초기화를 건너뜁니다.", 
						targetUserId, existingPayments.size());
				return;
			}
			
			log.info("사용자 {}에 대한 결제 데이터가 없습니다. 가데이터를 생성합니다.", targetUserId);
			
			User user = userRepository.findByUserId(targetUserId)
					.orElseGet(() -> {
						log.warn("지정된 userId '{}'를 가진 사용자가 없습니다. 첫 번째 사용자를 사용합니다.", targetUserId);
						return userRepository.findAll().stream()
								.findFirst()
								.orElseThrow(() -> {
									log.error("사용자 데이터가 없습니다. 먼저 사용자 데이터를 생성해주세요.");
									return new RuntimeException("사용자 데이터가 없습니다. 먼저 사용자 데이터를 생성해주세요.");
								});
					});

			log.info("사용자 조회 성공: {} (이름: {})", user.getUserId(), user.getUserName());

			// 결제 가데이터 생성
			LocalDateTime now = LocalDateTime.now();
			int createdCount = 0;

			// 결제 1: PAID 상태
			Payment payment1 = new Payment();
			payment1.setOrdNo("ORD-20251224-0001");
			payment1.setUser(user);
			payment1.setPayTypeCd("SINGLE_PAY");
			payment1.setRefId(1001L);
			payment1.setPayAmt(30000);
			payment1.setPayMethod("BANK");
			payment1.setSttsCd("PAID");
			payment1.setRegDt(now.minusDays(10));

			// 결제 2: PAID 상태
			Payment payment2 = new Payment();
			payment2.setOrdNo("ORD-20251224-0002");
			payment2.setUser(user);
			payment2.setPayTypeCd("SINGLE_PAY");
			payment2.setRefId(1002L);
			payment2.setPayAmt(30000);
			payment2.setPayMethod("BANK");
			payment2.setSttsCd("PAID");
			payment2.setRegDt(now.minusDays(8));

			// 결제 3: PAID 상태
			Payment payment3 = new Payment();
			payment3.setOrdNo("ORD-20251224-0003");
			payment3.setUser(user);
			payment3.setPayTypeCd("SINGLE_PAY");
			payment3.setRefId(1003L);
			payment3.setPayAmt(35000);
			payment3.setPayMethod("BANK");
			payment3.setSttsCd("PAID");
			payment3.setRegDt(now.minusDays(5));

			// 결제 4: PAID 상태
			Payment payment4 = new Payment();
			payment4.setOrdNo("ORD-20251224-0004");
			payment4.setUser(user);
			payment4.setPayTypeCd("SINGLE_PAY");
			payment4.setRefId(1004L);
			payment4.setPayAmt(30000);
			payment4.setPayMethod("BANK");
			payment4.setSttsCd("PAID");
			payment4.setRegDt(now.minusDays(3));

			// 저장
			try {
				paymentRepository.save(payment1);
				log.info("결제 1 저장 완료: 주문번호={}, 금액={}, 상태={}", 
						payment1.getOrdNo(), payment1.getPayAmt(), payment1.getSttsCd());
				createdCount++;
				
				paymentRepository.save(payment2);
				log.info("결제 2 저장 완료: 주문번호={}, 금액={}, 상태={}", 
						payment2.getOrdNo(), payment2.getPayAmt(), payment2.getSttsCd());
				createdCount++;
				
				paymentRepository.save(payment3);
				log.info("결제 3 저장 완료: 주문번호={}, 금액={}, 상태={}", 
						payment3.getOrdNo(), payment3.getPayAmt(), payment3.getSttsCd());
				createdCount++;
				
				paymentRepository.save(payment4);
				log.info("결제 4 저장 완료: 주문번호={}, 금액={}, 상태={}", 
						payment4.getOrdNo(), payment4.getPayAmt(), payment4.getSttsCd());
				createdCount++;
				
				log.info("========== 결제 가데이터 초기화 완료 ==========");
				log.info("사용자 {}에 대한 결제 {}건이 생성되었습니다.", user.getUserId(), createdCount);
			} catch (Exception e) {
				log.error("결제 저장 중 오류 발생: {}", e.getMessage(), e);
				throw e;
			}
		};
	}
}

