package com.project.app.pass_trade.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import com.project.app.pass_trade.domain.TransactionStatus;


@Data
public class PassTradeTransactionResponse {
    private Long transactionId;
    private Long postId;
    private String buyerId;
    private String sellerId;
    private Integer tradeCount;
    private Integer totalAmount;
    private TransactionStatus transactionStatus;
    private Long paymentId;
    private LocalDateTime regDt;
    private LocalDateTime updDt;
}