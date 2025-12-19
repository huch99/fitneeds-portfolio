package com.project.app.userAdmin.controller;

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

import com.project.app.config.security.JwtTokenProvider;
import com.project.app.userAdmin.dto.UserAdminRequestDto;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.service.UserAdminService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/")
public class UserAdminController {

	private final UserAdminService userAdminService;

	public UserAdminController(UserAdminService userAdminService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
		this.userAdminService = userAdminService;
	}

	@GetMapping("/all")
	public ResponseEntity<List<UserAdmin>> getAllUsers(){
		List<UserAdmin> users = userAdminService.getAllUsers();
		return ResponseEntity.ok(users);
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> createUser(@RequestBody UserAdminRequestDto userAdminRequestDto) {
		try {
			if (userAdminRequestDto.getUserId() == null || userAdminRequestDto.getPassword() == null) {
				return ResponseEntity.badRequest().body("아이디와 비밀번호는 필수 항목 입니다.");
			}
			if (userAdminService.existsByUserId(userAdminRequestDto.getUserId())) {
				return ResponseEntity.badRequest().body("이미 사용중인 아이디입니다.");
			}

			userAdminService.createAdminUser(userAdminRequestDto);

			return ResponseEntity.status(HttpStatus.CREATED).body(userAdminRequestDto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}
	}

	@GetMapping("/userinfo")
	public ResponseEntity<?> userinfo(@PathVariable String userId) {
		try {
			userAdminService.findByUserId(userId);

			return ResponseEntity.ok(userAdminService.findByUserId(userId)); // 200 OK와 사용자 정보 반환
		} catch (Exception e) {
			// 로깅 후 클라이언트에 에러 메시지 반환
			// Logger.error("사용자 정보 조회 중 오류 발생: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("사용자 정보 조회 처리 중 오류가 발생했습니다. : " + e.getMessage());
		}

	}

}