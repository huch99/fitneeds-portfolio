package com.project.app.pass_trade_transaction.service;

import com.project.app.pass_trade.dto.response.PassTradeTransactionResponse;
import com.project.app.pass_trade_transaction.repository.PassTradeTransactionQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// 거래 내역 조회 전용 서비스 (내부 사용)
// 외부 API로 노출되지 않음, 내부 조회(Read Model) 전용
// 관리자 화면, 통계, 분석용으로만 사용
@Service
@RequiredArgsConstructor
public class PassTradeTransactionService {

    private final PassTradeTransactionQueryRepository queryRepository;

    // 내부 조회용: 사용자별 전체 거래 내역
    public List<PassTradeTransactionResponse> getAllTransactions(String userId) {
        return queryRepository.findAllByUserId(userId);
    }

    // 내부 조회용: 거래 ID로 단건 조회
    public Optional<PassTradeTransactionResponse> getTransaction(Long transactionId) {
        return queryRepository.findByTransactionId(transactionId);
    }

    // 내부 조회용: 판매 거래 내역
    public List<PassTradeTransactionResponse> getSellTransactions(String userId) {
        return queryRepository.findSellTransactionsByUserId(userId);
    }

    // 내부 조회용: 구매 거래 내역
    public List<PassTradeTransactionResponse> getBuyTransactions(String userId) {
        return queryRepository.findBuyTransactionsByUserId(userId);
    }
}