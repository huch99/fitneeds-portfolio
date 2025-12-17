package com.project.app.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 보안 설정 클래스
 * 애플리케이션의 인증(로그인)과 인가(권한) 처리를 담당합니다
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	/**
	 * 보안 필터 체인 설정
	 * 어떤 URL은 인증 없이 접근 가능하고, 어떤 URL은 로그인이 필요한지 정의합니다
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenProvider jwtTokenProvider, CorsConfigurationSource corsConfigurationSource) throws Exception {
		http
				// CORS 활성화
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				// CSRF 보호 비활성화 (REST API에서는 일반적으로 비활성화)
				.csrf(csrf -> csrf.disable())

				// URL별 접근 권한 설정
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
						.anyRequest().authenticated()
				)

				// JWT 인증 필터를 Spring Security 필터 체인에 추가
				// 모든 요청이 들어올 때마다 JWT 토큰을 검사합니다
				.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
						UsernamePasswordAuthenticationFilter.class);

		// 세션을 사용하지 않음 (JWT 토큰 방식이므로)
		http.sessionManagement(session -> 
			session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		// ✅ 실제 운영 도메인들만 허용
		config.setAllowedOrigins(List.of(
				"https://fitneeds-admin.console.co.kr",
				"https://fitneeds.console.co.kr"
				// 필요하면 로컬 개발용도 추가:
				// "http://localhost:5173",
				// "http://localhost:5174"
		));

		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));

		// JWT Authorization 헤더를 쓴다면 노출/허용해주는 게 안전
		config.setExposedHeaders(List.of("Authorization"));

		// 쿠키 기반이 아니면 보통 false 권장.
		// (Authorization 헤더 JWT면 false로 두는 게 일반적)
		config.setAllowCredentials(false);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}


	/**
	 * 비밀번호 암호화 도구 등록
	 * BCrypt 알고리즘을 사용하여 비밀번호를 안전하게 암호화합니다
	 * 평문 비밀번호를 절대 데이터베이스에 저장하지 않습니다!
	 */
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}