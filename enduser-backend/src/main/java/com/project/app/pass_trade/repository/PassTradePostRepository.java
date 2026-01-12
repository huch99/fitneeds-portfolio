package com.project.app.pass_trade.repository;

import com.project.app.pass_trade.entity.PassTradePost;
import com.project.app.pass_trade.entity.TradeStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassTradePostRepository extends JpaRepository<PassTradePost, Long> {

    // 상태 기준 게시글 목록 조회 (최신순)




    List<PassTradePost> findByTradeStatusAndDeletedFalseOrderByRegDtDesc(TradeStatus tradeStatus);


    // 비관적 락 조회
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
SELECT p
FROM PassTradePost p
WHERE p.postId = :postId
  AND p.deleted = false
""")
    Optional<PassTradePost> findByIdWithLock(@Param("postId") Long postId);

    // 수정/삭제
    Optional<PassTradePost> findByPostIdAndSellerIdAndDeletedFalse(
            Long postId,
            String sellerId
    );

}
