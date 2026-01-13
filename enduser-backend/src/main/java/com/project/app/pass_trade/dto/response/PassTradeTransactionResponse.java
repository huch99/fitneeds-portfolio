package com.project.app.pass_trade.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.project.app.pass_trade.entity.TransactionStatus;


@Data
public class PassTradeTransactionResponse {
    private Long transactionId;
    private Long postId;
    private String buyerId;
    private String sellerId;
    private Integer buyQty;
//    private BigDecimal totalAmount;
    private BigDecimal tradeAmt;
    private TransactionStatus sttsCd;
    private Long paymentId;
    private LocalDateTime regDt;
    private LocalDateTime updDt;
}