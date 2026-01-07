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

import com.project.app.aspect.ApiResponse;
import com.project.app.userpass.dto.UserPassResponseDto;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/userpasses")
@RequiredArgsConstructor
@Slf4j
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
	public ResponseEntity<ApiResponse<List<UserPassResponseDto>>> getUserPassesByUserIdForR(@PathVariable("userId") String userId) {
		try {
			List<UserPass> userPasses = userPassService.getUserPassesByUserIdForR(userId);
			
			List<UserPassResponseDto> result = userPasses.stream()
	                .map(UserPassResponseDto::from)
	                .collect(Collectors.toList());
			return ResponseEntity.ok(ApiResponse.success(result));
		} catch (Exception e) {
			log.error("사용자 이용권 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(ApiResponse.error("이용권 정보를 불러오는 중 오류가 발생했습니다."));
		}
		
	}
	
	/**
     * 이용권을 사용 처리합니다.
     * 잔여 횟수를 1 감소시키고, 0이 되면 상태를 '사용 불가'로 업데이트합니다.
     *
     * @param userPassId 사용할 UserPass의 ID
     * @param requestBody 사용 사유를 포함하는 JSON 요청 바디 (예: {"reason": "스케줄 예약"})
     * @return 업데이트된 UserPass 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 이용권을 찾을 수 없거나 이미 잔여 횟수가 없는 경우
     */
    @PostMapping("/useUserPassForR/{userPassId}")
    public ResponseEntity<ApiResponse<UserPassResponseDto>> useUserPassForR(
            @PathVariable("userPassId") Long userPassId,
            @RequestBody Map<String, String> requestBody) {
        try {
        	// 1. 사유(reason) 추출 및 기본값 처리
        	String reason = requestBody.get("reason"); // "reason" 키의 값을 가져옴
            if (reason == null || reason.trim().isEmpty()) {
                reason = "스케줄 예약"; // 사유가 없으면 기본값 설정
            }

            // 2. 비즈니스 로직 실행 (이용권 차감)
        	UserPass updatedUserPass = userPassService.usePassForR(userPassId, reason); // <--- reason 전달
        	
        	// 3. 성공 응답 반환
        	return ResponseEntity.ok(ApiResponse.success(
                    UserPassResponseDto.from(updatedUserPass), 
                    "이용권이 성공적으로 차감되었습니다."
            ));
		} catch (IllegalArgumentException e) {
			// 잔여 횟수 부족, 만료된 이용권 등 비즈니스 예외 처리
	        log.warn("이용권 사용 불가 - userPassId: {}, 사유: {}", userPassId, e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(ApiResponse.error(e.getMessage()));
		} catch (Exception e) {
	        // 서버 내부 오류
	        log.error("이용권 사용 중 서버 오류 발생 - userPassId: {}", userPassId, e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(ApiResponse.error("이용권 처리 중 오류가 발생했습니다."));
	    }
        
    }
    
    /**
     * 예약 취소 처리 시 이용권의 잔여 횟수를 복원합니다.
     * 잔여 횟수를 1 증가시키고, 상태를 '사용 가능'으로 업데이트합니다.
     *
     * @param userPassId 복원할 UserPass의 ID
     * @param requestBody 복원 사유를 포함하는 JSON 요청 바디 (예: {"reason": "예약 취소"})
     * @return 업데이트된 UserPass 정보를 담은 응답 DTO
     * @throws IllegalArgumentException 이용권을 찾을 수 없거나 복원할 수 없는 경우 (초기 구매 수량 초과 등)
     */
    @PostMapping("/cancelUserPassForR/{userPassId}") 
    public ResponseEntity<ApiResponse<UserPassResponseDto>> cancelUserPassForR(
            @PathVariable("userPassId") Long userPassId,
            @RequestBody Map<String, String> requestBody) { // <--- RequestBody를 통해 사유를 받음
        try {
        	// 1. 취소 사유 추출
        	String reason = requestBody.get("reason"); // "reason" 키의 값을 가져옴
            if (reason == null || reason.trim().isEmpty()) {
                reason = "예약 취소로 이용권 복원"; // 사유가 없으면 기본값 설정
            }
            
            // 2. 비즈니스 로직 실행 (이용권 복구 및 예약 취소)
            UserPass updatedUserPass = userPassService.cancelReservationAndUpdateUserPassForR(userPassId, reason); // <--- reason 전달

            // 3. DTO 변환 및 성공 응답 반환
            UserPassResponseDto result = UserPassResponseDto.from(updatedUserPass);
            
            return ResponseEntity.ok(ApiResponse.success(result, "예약 취소 및 이용권 복구가 완료되었습니다."));
        } catch (Exception e) {
        	// 내부 로직 중 에러 발생 시 처리
            log.error("이용권 취소 처리 중 오류 - userPassId: {}", userPassId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("취소 처리 중 오류가 발생했습니다."));
		}
        
    }

    /**
     * 예외 발생 시 일관된 ApiResponse 포맷으로 응답합니다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
    	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
    }
}
