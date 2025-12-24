package com.project.app.payment.service;

import java.util.List;
import java.util.Map;

public interface PaymentService {
	/**
	 * 사용자의 결제내역 조회
	 */
	List<Map<String, Object>> getMyPayments(String userId);
}

