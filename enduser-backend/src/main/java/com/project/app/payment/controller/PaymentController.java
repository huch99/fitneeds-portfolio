package com.project.app.payment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.payment.dto.PaymentResponseDto;
import com.project.app.payment.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	
	private final PaymentService paymentService;
	
	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	/**
	 * 요청 헤더에서 사용자 ID를 가져옵니다.
	 * 프론트엔드의 localStorage에서 가져온 userId가 X-User-Id 헤더로 전달됩니다.
	 * 
	 * @param request HTTP 요청 객체
	 * @return 사용자 ID
	 */
	private String getCurrentUserId(HttpServletRequest request) {
		String userId = request.getHeader("X-User-Id");
		if (userId == null || userId.isEmpty()) {
			log.error("X-User-Id 헤더가 없습니다. localStorage에서 userId를 확인해주세요.");
			throw new RuntimeException("사용자 ID가 없습니다.");
		}
		log.debug("현재 사용자 ID (localStorage에서 가져옴): {}", userId);
		return userId;
	}

	/**
	 * 나의 결제내역 조회
	 * GET /api/payment/my
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyPayments(HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 결제내역 조회
			String currentUserId = getCurrentUserId(request);
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

