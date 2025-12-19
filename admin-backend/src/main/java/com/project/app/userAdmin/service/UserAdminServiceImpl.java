package com.project.app.userAdmin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.app.user.dto.UserRequestDto;
import com.project.app.userAdmin.dto.UserAdminRequestDto;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.repository.UserAdminRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserAdminServiceImpl implements UserAdminService {
	private final UserAdminRepository UserAdminRepository;
	private final PasswordEncoder passwordEncoder;

	public UserAdminServiceImpl(UserAdminRepository userAdminRepository, PasswordEncoder passwordEncoder) {
		this.UserAdminRepository = userAdminRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public UserAdmin createUser(UserRequestDto userRequestDto) {
		UserAdmin user = UserAdmin.builder().userId(userRequestDto.getUserId()).userName(userRequestDto.getUserName())
				.password(passwordEncoder.encode(userRequestDto.getPassword())) // 비밀번호 암호화
	                .role("ADMIN") // 기본 권한 설정 admin 사용자 관리 에서 수정.
				.build();

		return UserAdminRepository.save(user);
	}

	// 아이디 존재 유무조회
	public boolean existsByUserId(String userId) {
		return UserAdminRepository.existsByUserId(userId);
	}

	// email 존재 유무조회
	public boolean existsByEmail(String email) {
		return UserAdminRepository.existsByEmail(email);
	}

	// 아이디로 사용자 조회
	public Optional<UserAdmin> findByUserId(String userId) {
		return UserAdminRepository.findByUserId(userId);
	}

	public List<UserAdmin> getAllUsers() {
		return UserAdminRepository.findAll();
	}

	public Optional<UserAdmin> getUserByEmailAdmin(String email) {
		return UserAdminRepository.getUserByEmailAndRole(email, "ADMIN");
	}
	
	public Optional<UserAdmin> getUserByEmail(String email) {
        return UserAdminRepository.getUserByEmail(email);
    }

	@Override
	public UserAdmin createAdminUser(UserAdminRequestDto adminRequestDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
