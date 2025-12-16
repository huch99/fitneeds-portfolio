package com.project.app.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.admin.service.AdminService;
import com.project.app.config.security.JwtTokenProvider;
import com.project.app.user.dto.UserRequestDto;
import com.project.app.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class AdminController {

	private final AdminService adminService;

	public AdminController(UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
		this.adminService = adminService;
	}

	@GetMapping("/all")
	public ResponseEntity<List<Admin>> getAllUsers(){
		List<Admin> users = adminService.getAllUsers();
		return ResponseEntity.ok(users);
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> createUser(@RequestBody UserRequestDto userRequestDto) {
		try {
			if (userRequestDto.getUserId() == null || userRequestDto.getPassword() == null) {
				return ResponseEntity.badRequest().body("아이디와 비밀번호는 필수 항목 입니다.");
			}
			if (adminService.existsByUserId(userRequestDto.getUserId())) {
				return ResponseEntity.badRequest().body("이미 사용중인 아이디입니다.");
			}

			adminService.createUser(userRequestDto);

			return ResponseEntity.status(HttpStatus.CREATED).body(userRequestDto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}
	}

	@GetMapping("/userinfo")
	public ResponseEntity<?> userinfo(@PathVariable String userId) {
		try {
			adminService.findByUserId(userId);

			return ResponseEntity.ok(adminService.findByUserId(userId)); // 200 OK와 사용자 정보 반환
		} catch (Exception e) {
			// 로깅 후 클라이언트에 에러 메시지 반환
			// Logger.error("사용자 정보 조회 중 오류 발생: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("사용자 정보 조회 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}

	}

}