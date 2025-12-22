package com.project.app;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

/**
 * Spring Boot 애플리케이션의 시작점 (메인 클래스)
 * 
 * 특정 기능을 제외하고 싶을 때 아래 주석을 해제하세요:
 * - Batch 기능 제외: @SpringBootApplication(exclude = {BatchAutoConfiguration.class})
 * - JPA 기능 제외: @SpringBootApplication(exclude = {HibernateJpaAutoConfiguration.class})
 * - MyBatis 기능 제외: @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
 */
@SpringBootApplication
public class AppApplication {

	// 애플리케이션 실행 메소드
	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	/**
	 * RestTemplate Bean 등록
	 * 외부 API를 호출할 때 사용하는 HTTP 클라이언트 도구
	 */
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	
	/**
	 * 애플리케이션 시작 시 테스트용 사용자 계정 자동 생성
	 * 개발/테스트 환경에서 편리하게 사용하기 위한 기능
	 * 운영 환경에서는 이 메소드를 제거하거나 비활성화하세요!
	 */
	@Bean
	public CommandLineRunner createTestUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// 일반 사용자 계정 생성 (아이디: user, 비밀번호: user)
			if (!userRepository.existsByUserId("user1")) {
				User testUser = new User();
				testUser.setUserId("user1");
				testUser.setEmail("user1@naver.com");
				testUser.setUserName("User1");
//				testUser.setUserName("일반");
				// 비밀번호를 암호화하여 저장 (보안을 위해 평문 저장 금지!)
				testUser.setPassword(passwordEncoder.encode("user1"));
				testUser.setAuth("USER"); // 일반 사용자 권한
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 아이디: user1, 비밀번호: user1");
			}
			
			if (!userRepository.existsByUserId("user2")) {
				User testUser = new User();
				testUser.setUserId("user2");
				testUser.setEmail("user2@naver.com");
				testUser.setUserName("User2");
//				testUser.setUserName("일반");
				// 비밀번호를 암호화하여 저장 (보안을 위해 평문 저장 금지!)
				testUser.setPassword(passwordEncoder.encode("user2"));
				testUser.setAuth("USER"); // 일반 사용자 권한
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 아이디: user2, 비밀번호: user2");
			}

			// 관리자 계정 생성 (아이디: admin, 비밀번호: admin)
			if (!userRepository.existsByUserId("admin")) {
				User adminUser = new User();
				adminUser.setUserId("admin");
				adminUser.setEmail("admin@naver.com");
				adminUser.setUserName("Admin");
//				adminUser.setUserName("관리자");
				adminUser.setPassword(passwordEncoder.encode("admin"));
				adminUser.setAuth("ADMIN"); // 관리자 권한
				userRepository.save(adminUser);
				System.out.println("[테스트 계정 생성] 아이디: admin, 비밀번호: admin");
			}
			
			
		};
	}
	
	/**
	 * 애플리케이션 시작 시 결제 목록 가데이터 자동 생성
	 * 개발/테스트 환경에서 편리하게 사용하기 위한 기능
	 * 운영 환경에서는 이 메소드를 제거하거나 비활성화하세요!
	 */
	@Bean
	public CommandLineRunner createPaymentData(
			PaymentRepository paymentRepository, 
			UserRepository userRepository) {
		return args -> {
			// 사용자 조회
			User user1 = userRepository.findByUserId("user1").orElse(null);
			User user2 = userRepository.findByUserId("user2").orElse(null);
			User admin = userRepository.findByUserId("admin").orElse(null);
			
			if (user1 == null || user2 == null || admin == null) {
				System.out.println("[결제 가데이터 생성] 사용자 데이터가 없어 결제 데이터를 생성할 수 없습니다.");
				return;
			}
			
			// user1의 결제 내역 생성
			if (paymentRepository.findByUser_UserId("user1").isEmpty()) {
				// 결제 1: 예약 결제 (완료)
				Payment payment1 = Payment.builder()
						.orderNo("ORD20240101001")
						.user(user1)
						.payTypeCd("RESERVATION")
						.refId(null) // 외래키 제약조건을 피하기 위해 null로 설정
						.payAmount(50000)
						.payMethod("CARD")
						.statusCode("COMPLETED")
						.registrationDateTime(LocalDateTime.of(2024, 1, 15, 10, 30, 0))
						.build();
				paymentRepository.save(payment1);
				
				// 결제 2: 예약 결제 (완료)
				Payment payment2 = Payment.builder()
						.orderNo("ORD20240102002")
						.user(user1)
						.payTypeCd("RESERVATION")
						.refId(null) // 외래키 제약조건을 피하기 위해 null로 설정
						.payAmount(30000)
						.payMethod("BANK_TRANSFER")
						.statusCode("COMPLETED")
						.registrationDateTime(LocalDateTime.of(2024, 1, 20, 14, 20, 0))
						.build();
				paymentRepository.save(payment2);
			
			// user2의 결제 내역 생성
			if (paymentRepository.findByUser_UserId("user2").isEmpty()) {
				// 결제 3: 예약 결제 (완료)
				Payment payment3 = Payment.builder()
						.orderNo("ORD20240105005")
						.user(user2)
						.payTypeCd("RESERVATION")
						.refId(null) // 외래키 제약조건을 피하기 위해 null로 설정
						.payAmount(40000)
						.payMethod("CARD")
						.statusCode("COMPLETED")
						.registrationDateTime(LocalDateTime.of(2024, 1, 18, 11, 0, 0))
						.build();
				paymentRepository.save(payment3);
				
				// 결제 4: 예약 결제 (완료)
				Payment payment4 = Payment.builder()
						.orderNo("ORD20240107007")
						.user(user2)
						.payTypeCd("RESERVATION")
						.refId(null) // 외래키 제약조건을 피하기 위해 null로 설정
						.payAmount(35000)
						.payMethod("CARD")
						.statusCode("COMPLETED")
						.registrationDateTime(LocalDateTime.of(2024, 2, 5, 15, 20, 0))
						.build();
				paymentRepository.save(payment4);
				
				System.out.println("[결제 가데이터 생성] user2의 결제 데이터 3건 생성 완료");
			}
			

				
				System.out.println("[결제 가데이터 생성] admin의 결제 데이터 5건 생성 완료");
			}
			
			System.out.println("[결제 가데이터 생성] 총 " + paymentRepository.count() + "건의 결제 데이터가 준비되었습니다.");
		};
	}

}
