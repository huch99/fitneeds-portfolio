package com.project.app.payment.service;

import java.util.List;

import com.project.app.payment.dto.PaymentResponseDto;

public interface PaymentService {
	/**
	 * 나의 결제내역 조회
	 * @param userId 사용자 ID
	 * @return 결제내역 목록
	 */
	List<PaymentResponseDto> getMyPayments(String userId);
}

