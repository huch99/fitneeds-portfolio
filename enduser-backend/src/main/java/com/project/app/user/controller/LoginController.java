package com.project.app.user.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.config.security.JwtTokenProvider;
import com.project.app.user.dto.LoginRequestDto;
import com.project.app.user.dto.LoginResponseDto;
import com.project.app.user.entity.User;
import com.project.app.user.service.LoginService;
import com.project.app.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

/**
 * 로그인 처리 컨트롤러
 * 사용자 로그인 요청을 받아 JWT 토큰을 발급합니다
 */
@Slf4j
@RestController
@RequestMapping(value = {"/api/auth"})
public class LoginController {

	// 사용자 정보를 처리하는 서비스
	private final UserService userService;
	
	// JWT 토큰을 생성하는 클래스
	private final JwtTokenProvider jwtTokenProvider;
	
	// 비밀번호를 암호화/검증하는 도구
	private PasswordEncoder passwordEncoder;

	// 생성자: 필요한 의존성들을 주입받습니다
	public LoginController(UserService userService, 
			JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.jwtTokenProvider = jwtTokenProvider;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * 로그인 API
	 * POST /api/login 또는 /api/auth/login
	 * 
	 * 요청 본문 예시:
	 * {
	 *   "userId": "user",
	 *   "password": "user"
	 * }
	 * 
	 * 응답 예시:
	 * {
	 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	 *   "user": {
	 *     "id": 1,
	 *     "userId": "user",
	 *     "userName": "일반",
	 *     "auth": "USER",
	 *     "success": true,
	 *     "message": "로그인 성공"
	 *   }
	 * }
	 */
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
		log.info("[LOGIN] 로그인 시도 - userId: {}", loginRequestDto != null ? loginRequestDto.getUserId() : "null");
		
		try {
			// 요청 본문 검증
			if (loginRequestDto == null || loginRequestDto.getUserId() == null || loginRequestDto.getUserId().trim().isEmpty()) {
				log.warn("[LOGIN] userId가 비어있습니다.");
				return ResponseEntity.badRequest()
						.body(Map.of("error", "Bad Request", "message", "아이디를 입력해주세요."));
			}
			
			if (loginRequestDto.getPassword() == null || loginRequestDto.getPassword().trim().isEmpty()) {
				log.warn("[LOGIN] password가 비어있습니다.");
				return ResponseEntity.badRequest()
						.body(Map.of("error", "Bad Request", "message", "비밀번호를 입력해주세요."));
			}
			
			// 1. 데이터베이스에서 사용자 조회
			User user = userService.findByUserId(loginRequestDto.getUserId().trim())
					.orElse(null);
			
			if (user == null) {
				log.warn("[LOGIN] 사용자를 찾을 수 없습니다: {}", loginRequestDto.getUserId());
				return ResponseEntity.status(401)
						.body(Map.of("error", "Unauthorized", "message", "가입되지 않은 아이디입니다."));
			}
			
			// 2. 비밀번호 확인
			// ⚠️ 보안 경고: admin 사용자는 평문 비밀번호를 사용 (개발/테스트 목적)
			// 일반 사용자는 BCrypt 해시로 암호화된 비밀번호를 사용
			boolean passwordMatches;
			String inputPassword = loginRequestDto.getPassword().trim();
			String storedPassword = user.getPassword();
			
			if ("ADMIN".equals(user.getAuth()) || "admin".equals(user.getUserId())) {
				// admin 사용자: 평문 비밀번호 직접 비교
				passwordMatches = inputPassword != null && storedPassword != null && inputPassword.equals(storedPassword);
				log.info("[LOGIN] Admin 사용자 평문 비밀번호 비교 - 입력: '{}', 저장: '{}', 일치: {}", 
					inputPassword, storedPassword, passwordMatches);
			} else {
				// 일반 사용자: BCrypt 해시 비교
				passwordMatches = storedPassword != null && 
					passwordEncoder.matches(inputPassword, storedPassword);
				log.debug("[LOGIN] 일반 사용자 BCrypt 비밀번호 비교");
			}
			
			if (!passwordMatches) {
				log.warn("[LOGIN] 비밀번호가 일치하지 않습니다: {} (입력: '{}', 저장: '{}')", 
					loginRequestDto.getUserId(), inputPassword, storedPassword);
				return ResponseEntity.status(401)
						.body(Map.of("error", "Unauthorized", "message", "잘못된 비밀번호입니다."));
			}
			
			// 3. 사용자 권한 정보 설정
			List<String> roles = new ArrayList<>();
			roles.add(user.getAuth()); // USER, ADMIN 등

			// 4. JWT 토큰 생성 (사용자 아이디와 권한 정보 포함)
			String token = jwtTokenProvider.createToken(user.getUserId(), roles);

			// 5. 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("token", token); // 클라이언트에서 저장하여 사용할 토큰
			response.put("user", LoginResponseDto.builder()
					.userId(user.getUserId())
					.userName(user.getUserName())
					.auth(user.getAuth())
					.success(true)
					.message("로그인 성공")
					.build());

			log.info("[LOGIN] 로그인 성공: {}", user.getUserId());
			// 6. HTTP 200 OK와 함께 응답 반환
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("[LOGIN] 로그인 처리 중 오류 발생", e);
			return ResponseEntity.status(500)
					.body(Map.of("error", "Internal Server Error", "message", "로그인 처리 중 오류가 발생했습니다."));
		}
	}
}