package com.project.app.pass_trade_favorite.service;

import com.project.app.pass_trade_favorite.dto.PassTradeFavoriteResponse;
import com.project.app.pass_trade_favorite.repository.PassTradeFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

// 이용권 거래 게시글 즐겨찾기 서비스
// 거래 게시글에 대한 즐겨찾기 추가/해제/조회 담당
// pass_trade와 독립적으로 운영되는 부가 기능
@Service
@Transactional
@RequiredArgsConstructor
public class PassTradeFavoriteService {

    private final PassTradeFavoriteRepository favoriteRepository;

    // 즐겨찾기 추가
    // 중복 체크 후 즐겨찾기 등록
    public PassTradeFavoriteResponse addFavorite(String userId, Long postId) {
        if (favoriteRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("이미 즐겨찾기에 추가된 게시글입니다.");
        }
        return favoriteRepository.save(userId, postId);
    }

    // 즐겨찾기 해제
    public void removeFavorite(String userId, Long postId) {
        favoriteRepository.deleteByUserIdAndPostId(userId, postId);
    }

    // 사용자별 즐겨찾기 목록 조회
    public List<PassTradeFavoriteResponse> getFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // 특정 게시글 즐겨찾기 여부 확인
    public Optional<PassTradeFavoriteResponse> isFavorite(String userId, Long postId) {
        return favoriteRepository.findByUserIdAndPostId(userId, postId);
    }
}