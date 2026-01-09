package com.project.app.pass_trade.repository;

import com.project.app.pass_trade.domain.PassTradeTransaction;
import com.project.app.pass_trade.domain.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassTradeTransactionRepository extends JpaRepository<PassTradeTransaction, Long> {

    List<PassTradeTransaction> findByPostIdOrderByRegDtDesc(Long postId);

    Optional<PassTradeTransaction> findByPostIdAndTransactionStatusIn(
            Long postId, List<TransactionStatus> statuses);
}