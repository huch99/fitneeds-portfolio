package com.project.app.pass_trade_transaction.repository;
import com.project.app.pass_trade_transaction.entity.PassTradeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassTradeTransactionRepository
        extends JpaRepository<PassTradeTransaction, Long> {

    /**
     * ✅ 내가 판매한 거래 내역
     * - 거래 테이블(t)은 postId만 있고 sellerId는 post 테이블에 있음
     * - 그래서 post 조인해서 sellerId 필터링
     */
    @Query(value = """
    SELECT t.*
    FROM PASS_TRADE_TRANSACTION t
    JOIN PASS_TRADE_POST p ON t.post_id = p.post_id
    WHERE p.seller_id = :sellerId
    ORDER BY t.reg_dt DESC
""", nativeQuery = true)
    List<PassTradeTransaction> findSellTransactions(@Param("sellerId") String sellerId);

    /**
     * ✅ 내가 구매한 거래 내역
     * - 거래 테이블에 buyerId가 직접 있음
     */
    List<PassTradeTransaction> findByBuyerIdOrderByRegDtDesc(String buyerId);
}
