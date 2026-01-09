package com.project.app.pass_trade_favorite.repository;

import com.project.app.pass_trade_favorite.dto.PassTradeFavoriteResponse;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 즐겨찾기 데이터 접근 계층
// 즐겨찾기 테이블 CRUD 담당
// pass_trade와 독립적으로 운영되는 부가 기능용 Repository
@Repository
public class PassTradeFavoriteRepository {

    // 즐겨찾기 추가
    public PassTradeFavoriteResponse save(String userId, Long postId) {
        // TODO: 즐겨찾기 추가 로직
        PassTradeFavoriteResponse response = new PassTradeFavoriteResponse();
        response.setFavoriteId(System.currentTimeMillis());
        response.setUserId(userId);
        response.setPostId(postId);
        response.setFavorite(true);
        return response;
    }

    // 즐겨찾기 삭제
    public void deleteByUserIdAndPostId(String userId, Long postId) {
        // TODO: 즐겨찾기 삭제 로직
    }

    // 사용자별 즐겨찾기 목록 조회
    public List<PassTradeFavoriteResponse> findByUserId(String userId) {
        // TODO: 사용자별 즐겨찾기 목록 조회
        return List.of();
    }

    // 특정 게시글 즐겨찾기 여부 조회
    public Optional<PassTradeFavoriteResponse> findByUserIdAndPostId(String userId, Long postId) {
        // TODO: 특정 게시글 즐겨찾기 여부 조회
        return Optional.empty();
    }

    // 즐겨찾기 존재 여부 확인
    public boolean existsByUserIdAndPostId(String userId, Long postId) {
        // TODO: 즐겨찾기 존재 여부 확인
        return false;
    }
}