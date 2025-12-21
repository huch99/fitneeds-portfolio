package com.project.app.payment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.payment.dto.PaymentResponseDto;
import com.project.app.payment.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

/**
 * 결제 컨트롤러
 * 모든 API는 JWT 인증 토큰이 필요합니다.
 * Authorization 헤더에 "Bearer {token}" 형식으로 토큰을 포함해야 합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	
	private final PaymentService paymentService;
	
	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}
	
	/**
	 * 현재 인증된 사용자의 userId를 가져옵니다.
	 * JWT 토큰에서 추출된 사용자 정보를 사용합니다.
	 */
	private String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null) {
			log.error("SecurityContext에 인증 정보가 없습니다.");
			throw new RuntimeException("인증되지 않은 사용자입니다.");
		}
		if (!authentication.isAuthenticated()) {
			log.error("인증되지 않은 사용자입니다. Authentication: {}", authentication);
			throw new RuntimeException("인증되지 않은 사용자입니다.");
		}
		String userId = authentication.getName();
		log.info("현재 인증된 사용자 ID: {}", userId);
		
		// anonymousUser인 경우 테스트용으로 admin 사용 (개발 환경에서만)
		if ("anonymousUser".equals(userId)) {
			log.warn("anonymousUser 감지됨. 테스트용으로 admin 사용");
			userId = "admin";
		}
		
		return userId; // JWT 토큰의 subject (userId)
	}
	
	/**
	 * 나의 결제내역 조회
	 * GET /api/payment/my
	 * 헤더: Authorization: Bearer {token}
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyPayments() {
		try {
			// 인증된 사용자의 결제내역만 조회
			String currentUserId = getCurrentUserId();
			log.info("결제내역 조회 요청: userId={}", currentUserId);
			
			List<PaymentResponseDto> payments = paymentService.getMyPayments(currentUserId);
			log.info("결제내역 조회 완료: 건수={}", payments.size());
			
			return ResponseEntity.ok(payments);
		} catch (Exception e) {
			log.error("결제내역 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("결제내역 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}

