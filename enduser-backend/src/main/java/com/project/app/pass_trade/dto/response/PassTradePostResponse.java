package com.project.app.pass_trade.dto.response;

import com.project.app.pass_trade.entity.TradeStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// 거래 게시글 응답 DTO
// 거래 게시글 정보를 클라이언트에 전송하는 데이터
// saleAmount(총 판매 금액) 기준 사용, pricePerUnit 제거
@Data
public class PassTradePostResponse {
    
    // 게시글 ID
    private Long postId;
    
    // 판매자 ID
    private String sellerId;
    
    // 판매 대상 이용권 ID
    private Long userPassId;
    
    // 판매 수량
    private Integer sellCount;
    
    // 전체 판매 금액 (pricePerUnit 제거)
    private BigDecimal saleAmount;
    
    // 게시글 제목
    private String title;
    
    // 게시글 내용
    private String content;
    
    // 거래 상태 (SELLING, SOLD, CANCELED)
    private TradeStatus tradeStatus;
    
    // 등록일시
    private LocalDateTime regDt;
    
    // 수정일시
    private LocalDateTime updDt;
}