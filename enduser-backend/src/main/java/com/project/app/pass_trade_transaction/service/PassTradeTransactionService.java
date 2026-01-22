package com.project.app.pass_trade_transaction.service;

import com.project.app.pass_trade_transaction.dto.response.PassTradeTransactionResponse;
import com.project.app.pass_trade_transaction.repository.PassTradeTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassTradeTransactionService {

    private final PassTradeTransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public List<PassTradeTransactionResponse> getSellTransactions(String sellerId) {
        return transactionRepository.findSellTransactions(sellerId)
                .stream()
                .map(PassTradeTransactionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PassTradeTransactionResponse> getBuyTransactions(String buyerId) {
        return transactionRepository.findByBuyerIdOrderByRegDtDesc(buyerId)
                .stream()
                .map(PassTradeTransactionResponse::from)
                .toList();
    }
}
