package com.project.app.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	
	/**
	 * 사용자 ID로 결제 목록 조회
	 */
	List<Payment> findByUserUserIdOrderByRegDtDesc(String userId);
}

