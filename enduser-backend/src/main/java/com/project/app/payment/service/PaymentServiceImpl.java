package com.project.app.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;

	@Override
	public List<Map<String, Object>> getMyPayments(String userId) {
		log.info("[PaymentServiceImpl] getMyPayments 호출 - userId: {}", userId);
		
		List<Payment> payments = paymentRepository.findByUserUserIdOrderByRegDtDesc(userId);
		
		if (payments.isEmpty()) {
			log.warn("[PaymentServiceImpl] userId: {} 에 대한 결제 데이터가 없습니다.", userId);
		} else {
			log.info("[PaymentServiceImpl] DB 조회 결과 개수: {}", payments.size());
		}
		
		return payments.stream()
				.map(this::convertToMap)
				.collect(Collectors.toList());
	}

	private Map<String, Object> convertToMap(Payment payment) {
		Map<String, Object> map = new HashMap<>();
		
		// 기본 결제 정보
		map.put("payId", payment.getPayId());
		map.put("ordNo", payment.getOrdNo());
		map.put("paymentDate", payment.getRegDt());
		map.put("date", payment.getRegDt());
		map.put("paymentAmount", payment.getPayAmt());
		map.put("payAmt", payment.getPayAmt());
		map.put("price", payment.getPayAmt());
		map.put("payMethod", payment.getPayMethod());
		map.put("paymentStatus", payment.getSttsCd());
		map.put("sttsCd", payment.getSttsCd());
		map.put("payTypeCd", payment.getPayTypeCd());
		map.put("refId", payment.getRefId());
		
		// 사용자 정보
		if (payment.getUser() != null) {
			map.put("userId", payment.getUser().getUserId());
			map.put("userName", payment.getUser().getUserName());
		}
		
		// 결제 상태에 따른 option 설정 (refId가 있으면 개인 레슨으로 간주)
		if (payment.getRefId() != null) {
			map.put("option", "개인 레슨");
			map.put("trainerName", ""); // 필요시 refId로 스케줄 조회하여 강사명 설정 가능
		} else {
			map.put("option", "그룹 레슨");
		}
		
		return map;
	}
}

