package com.project.app;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.project.app.config.util.UserIdGenerator;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

/**
 * Spring Boot 애플리케이션의 시작점 (메인 클래스)
 * 
 * 특정 기능을 제외하고 싶을 때 아래 주석을 해제하세요: - Batch 기능 제외: @SpringBootApplication(exclude
 * = {BatchAutoConfiguration.class}) - JPA 기능 제외: @SpringBootApplication(exclude
 * = {HibernateJpaAutoConfiguration.class}) - MyBatis 기능
 * 제외: @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
 */
@SpringBootApplication
@EnableScheduling
public class AppApplication {

	// 애플리케이션 실행 메소드
	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	/**
	 * RestTemplate Bean 등록 외부 API를 호출할 때 사용하는 HTTP 클라이언트 도구
	 */
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	/**
	 * 애플리케이션 시작 시 테스트용 사용자 계정 자동 생성 개발/테스트 환경에서 편리하게 사용하기 위한 기능 운영 환경에서는 이 메소드를
	 * 제거하거나 비활성화하세요!
	 */
	@Bean
	public CommandLineRunner createTestUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		UserIdGenerator generator = new UserIdGenerator();
		return args -> {

			// 일반 사용자 계정 생성 (아이디: user, 비밀번호: user)
			if (!userRepository.existsByUserId("user1")) {
				User testUser = new User();
				testUser.setUserId(generator.generateUniqueUserId());
				testUser.setEmail("user1@naver.com");
				testUser.setUserName("User1");
//										testUser.setUserName("일반");
				// 비밀번호를 암호화하여 저장 (보안을 위해 평문 저장 금지!)
				testUser.setPassword(passwordEncoder.encode("user1"));
				testUser.setRole("USER"); // 일반 사용자 권한
				testUser.setCashPoint(0);
				testUser.setGradePoint(0);
				testUser.setPhoneNumber("01099111234");
				testUser.setAgreeAt(LocalDateTime.now());
				testUser.setIsActive(true);
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 아이디: user1, 비밀번호: user1");
			}

			if (!userRepository.existsByUserId("user2")) {
				User testUser = new User();
				testUser.setUserId(generator.generateUniqueUserId());
				testUser.setEmail("user2@naver.com");
				testUser.setUserName("User2");
//										testUser.setUserName("일반");
				// 비밀번호를 암호화하여 저장 (보안을 위해 평문 저장 금지!)
				testUser.setPassword(passwordEncoder.encode("user2"));
				testUser.setRole("USER"); // 일반 사용자 권한
				testUser.setCashPoint(0);
				testUser.setGradePoint(0);
				testUser.setPhoneNumber("01022221234");
				testUser.setAgreeAt(LocalDateTime.now());
				testUser.setIsActive(true);
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 아이디: user2, 비밀번호: user2");
			}

		};
	}

}
