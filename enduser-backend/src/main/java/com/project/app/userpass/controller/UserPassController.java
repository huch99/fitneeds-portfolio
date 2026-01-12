package com.project.app.userpass.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.userpass.dto.UserPassResponseDto;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/userpasses")
@RequiredArgsConstructor
public class UserPassController {

    private final UserPassService userPassService;


    /**
     * 특정 사용자 ID에 해당하는 모든 이용권 목록을 조회합니다.
     * 이 메서드는 사용자의 현재 예약 가능 또는 사용 완료된 이용권 정보를 프론트엔드에 제공합니다.
     *
     * @param userId 조회할 사용자의 ID (문자열 타입으로 가정)
     * @return 해당 사용자의 UserPass 정보를 담은 응답 DTO 목록
     */
	@GetMapping("/getUserPassesByUserIdForR/{userId}")
	public List<UserPassResponseDto> getUserPassesByUserIdForR(@PathVariable("userId") String userId) {
		List<UserPass> userPasses = userPassService.getUserPassesByUserIdForR(userId);
		
		return userPasses.stream()
				.map(UserPassResponseDto::from)
				.collect(Collectors.toList());
	}
	

    // 서비스 계층에서 발생한 IllegalArgumentException을 받아서 400 Bad Request로 응답합니다.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}