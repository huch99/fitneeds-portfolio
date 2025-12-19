package com.project.app;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

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
	 * 애플리케이션 시작 시 admin 계정 자동 생성
	 * ⚠️ 보안 경고: admin 사용자는 평문 비밀번호를 사용합니다 (개발/테스트 목적)
	 * 운영 환경에서는 이 메소드를 제거하거나 비활성화하세요!
	 */
	@Bean
	public CommandLineRunner createAdminUser(UserRepository userRepository) {
		return args -> {
			// 관리자 계정 생성 (아이디: admin, 비밀번호: admin - 평문 저장)
			// ⚠️ 중요: userId는 @GeneratedValue가 없으므로 반드시 직접 설정해야 함
			if (!userRepository.existsByUserId("admin")) {
				User adminUser = User.builder()
						.userId("admin")  // ⭐ 필수: PK이므로 반드시 설정
						.email("admin@example.com")
						.userName("관리자")
						.password("admin")  // ⚠️ 평문 비밀번호 저장 (개발/테스트 목적)
						.auth("ADMIN")  // 관리자 권한
						.build();
				userRepository.save(adminUser);
				System.out.println("========================================");
				System.out.println("[관리자 계정 생성] 아이디: admin, 비밀번호: admin (평문)");
				System.out.println("⚠️ 경고: 운영 환경에서는 평문 비밀번호를 사용하지 마세요!");
				System.out.println("========================================");
			} else {
				// 기존 admin 사용자의 비밀번호를 평문으로 업데이트
				userRepository.findByUserId("admin").ifPresent(admin -> {
					if (!"admin".equals(admin.getPassword())) {
						admin.setPassword("admin");  // 평문 비밀번호로 업데이트
						userRepository.save(admin);
						System.out.println("[관리자 계정 업데이트] admin 비밀번호를 평문으로 변경");
					}
				});
			}
		};
	}
}
