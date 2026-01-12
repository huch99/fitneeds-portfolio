package com.project.app.pass_trade.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pass_trade_transaction")
@Data
@NoArgsConstructor
public class PassTradeTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "buyer_id", nullable = false)
    private String buyerId;

    @Column(name = "seller_id", nullable = false)
    private String sellerId;

    @Column(name = "trade_count", nullable = false)
    private Integer tradeCount;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false)
    private TransactionStatus transactionStatus = TransactionStatus.REQUESTED;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "reg_dt", updatable = false)
    private LocalDateTime regDt;

    @Column(name = "upd_dt")
    private LocalDateTime updDt;

    @PrePersist
    protected void onCreate() {
        this.regDt = LocalDateTime.now();
        this.updDt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updDt = LocalDateTime.now();
    }
}