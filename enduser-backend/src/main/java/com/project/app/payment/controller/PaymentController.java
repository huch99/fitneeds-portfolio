package com.project.app.payment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

	/**
	 * ========================= 내 결제내역 조회 =========================
	 * GET /api/payment/my?userId=UUID
	 * 
	 * 결제 데이터를 기반으로 결제내역을 반환합니다.
	 */
	@GetMapping("/my")
	public ResponseEntity<List<Map<String, Object>>> getMyPayments(
			@RequestParam("userId") String userId) {
		log.info("[PaymentController] getMyPayments 호출 - userId: {}", userId);
		
		List<Map<String, Object>> payments = paymentService.getMyPayments(userId);
		log.info("[PaymentController] 조회 결과 개수: {}", payments != null ? payments.size() : 0);
		
		if (payments != null && !payments.isEmpty()) {
			log.info("[PaymentController] 첫 번째 결제 데이터: {}", payments.get(0));
		}
		
		return ResponseEntity.ok(payments);
	}
}

