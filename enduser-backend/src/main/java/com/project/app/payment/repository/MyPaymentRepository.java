package com.project.app.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.app.payment.entity.Payment;

public interface MyPaymentRepository extends JpaRepository<Payment, Long> {

    // (기존 쿼리: findByUserId)
    // 이 쿼리는 이제 p.user 필드가 있으므로 정상 작동해야 합니다.
    @Query("SELECT p FROM Payment p " +
           "WHERE p.user.userId = :userId " +
           "ORDER BY p.regDt DESC")
    List<Payment> findByUserId(@Param("userId") String userId);


    // --- findByUserIdWithDetails 쿼리 수정 ---
    // p.refId = r.rsvId 대신 p.reservation.rsvId 또는 p.reservation 필드 자체를 사용
    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN p.reservation r " +   // Payment 엔티티의 `reservation` 필드를 통한 조인
           "LEFT JOIN r.schedule s " +      // Reservation 엔티티의 `schedule` 필드를 통한 조인
           "LEFT JOIN s.program prg " +     // Schedule 엔티티의 `program` 필드를 통한 조인
           "WHERE p.user.userId = :userId " +
           "ORDER BY p.regDt DESC")
    List<Payment> findByUserIdWithDetails(@Param("userId") String userId);
}