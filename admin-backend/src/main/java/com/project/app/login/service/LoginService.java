package com.project.app.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.app.login.dto.LoginRequestDto;
import com.project.app.login.dto.LoginResponseDto;
import com.project.app.userAdmin.repository.UserAdminRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LoginService {

    @Autowired
    private UserAdminRepository userAdminRepository;
    
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        return userAdminRepository.findByUserId(loginRequestDto.getUserId())
                .filter(userAdmin -> userAdmin.getPassword().equals(loginRequestDto.getPassword()))
                .map(userAdmin -> LoginResponseDto.builder()
                        .userId(userAdmin.getUserId())
                        .userName(userAdmin.getUserName())
                        .role(userAdmin.getRole())
                        .brchId(userAdmin.getBrchId().getBrchId())
                        .success(true)
                        .message("로그인 성공")
                        .build())
                .orElse(LoginResponseDto.builder()
                        .success(false)
                        .message("이메일 또는 비밀번호가 일치하지 않습니다.")
                        .build());
    }
}