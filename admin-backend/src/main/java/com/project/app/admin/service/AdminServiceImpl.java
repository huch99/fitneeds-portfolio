package com.project.app.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.app.admin.repository.AdminRepository;
import com.project.app.user.dto.UserRequestDto;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {
	private final AdminRepository adminRepository;
	private final PasswordEncoder passwordEncoder;

	public UserServiceImpl(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
		this.adminRepository = adminRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public User createUser(UserRequestDto userRequestDto) {
		User user = User.builder().userId(userRequestDto.getUserId()).userName(userRequestDto.getUserName())
				.password(passwordEncoder.encode(userRequestDto.getPassword())) // 비밀번호 암호화
//	                .auth("USER") // 기본 권한 설정 admin 사용자 관리 에서 수정.
				.build();

		return userRepository.save(user);
	}

	// 아이디 존재 유무조회
	public boolean existsByUserId(String userId) {
		return adminRepository.existsByUserId(userId);
	}

	// email 존재 유무조회
	public boolean existsByEmail(String email) {
		return adminRepository.existsByEmail(email);
	}

	// 아이디로 사용자 조회
	public Optional<Admin> findByUserId(String userId) {
		return adminRepository.findByUserId(userId);
	}

	public List<Admin> getAllUsers() {
		return adminRepository.findAll();
	}

	public Optional<Admin> getUserByEmailAdmin(String email) {
		return adminRepository.getUserByEmailAndRole(email, "ADMIN");
	}
	
	public Optional<Admin> getUserByEmail(String email) {
        return adminRepository.getUserByEmail(email);
    }

}
