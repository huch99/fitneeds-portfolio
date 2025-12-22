package com.project.app.payment.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.project.app.user.entity.User;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pay_id")
    private Long paymentId;

    @Column(name = "ord_no", nullable = false, unique = true)
    private String orderNo;

    @ManyToOne
    @JoinColumn(name = "usr_id", nullable = true)
    private User user;

    @Column(name = "pay_type_cd", nullable = false)
    private String payTypeCd;

    @Column(name = "ref_id")
    private Long refId; // 예약ID, 상품ID 등

    @Column(name = "ref_type", length = 20)
    private String refType; // RESERVATION, PRODUCT

    @Column(name = "pay_amt", nullable = false)
    private Integer payAmount;

    @Column(name = "pay_method", nullable = false)
    private String payMethod;

    @Column(name = "stts_cd", nullable = false)
    private String statusCode;

    @Column(name = "reg_dt", nullable = false)
    private LocalDateTime registrationDateTime;

    @Column(name = "pg_order_no")
    private String pgOrderNo;
}
