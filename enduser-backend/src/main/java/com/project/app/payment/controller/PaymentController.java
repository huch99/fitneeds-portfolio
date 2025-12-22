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

@Slf4j
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	
	private final PaymentService paymentService;
	
	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

		/**
	 * 나의 결제내역 조회
	 * GET /api/payment/my
	 */
	@GetMapping("/my/{id}")
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

