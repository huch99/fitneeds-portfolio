package com.project.app.pass_trade_transaction.repository;

import com.project.app.pass_trade.dto.response.PassTradeTransactionResponse;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PassTradeTransactionQueryRepository {

    public List<PassTradeTransactionResponse> findAllByUserId(String userId) {
        // TODO: PASS_TRADE_TRANSACTION 테이블에서 buyerId 또는 sellerId가 userId인 모든 거래 조회
        return List.of();
    }

    public Optional<PassTradeTransactionResponse> findByTransactionId(Long transactionId) {
        // TODO: 거래 ID로 단건 조회
        return Optional.empty();
    }

    public List<PassTradeTransactionResponse> findSellTransactionsByUserId(String userId) {
        // TODO: sellerId가 userId인 판매 거래 내역 조회
        return List.of();
    }

    public List<PassTradeTransactionResponse> findBuyTransactionsByUserId(String userId) {
        // TODO: buyerId가 userId인 구매 거래 내역 조회
        return List.of();
    }
}