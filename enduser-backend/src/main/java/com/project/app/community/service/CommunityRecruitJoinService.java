package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostDetailMapper;
import com.project.app.community.mapper.CommunityRecruitJoinMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityRecruitJoinService {

    private final CommunityRecruitJoinMapper recruitJoinMapper;
    private final CommunityPostDetailMapper communityPostDetailMapper;

    public CommunityRecruitJoinService(
            CommunityRecruitJoinMapper recruitJoinMapper,
            CommunityPostDetailMapper communityPostDetailMapper
    ) {
        this.recruitJoinMapper = recruitJoinMapper;
        this.communityPostDetailMapper = communityPostDetailMapper;
    }

    /**
     * =========================
     * 모집 글 참여 신청
     * =========================
     *
     * 규칙:
     * 1. 모집 글만 신청 가능
     * 2. 작성자는 신청 불가
     * 3. 중복 신청 불가
     */
    @Transactional
    public void applyRecruit(Long postId, String userId) {

        // 1️⃣ 게시글 상세 조회 (USER 기준)
        CommunityPostDto post =
                communityPostDetailMapper.selectVisiblePostDetail(postId);

        if (post == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        // 2️⃣ 모집 글인지 확인
        if (!"모집".equals(post.getCategory())) {
            throw new IllegalStateException("모집 글만 참여 신청이 가능합니다.");
        }

        // 3️⃣ 작성자 본인 신청 방지
        if (userId.equals(post.getWriterId())) {
            throw new IllegalStateException("작성자는 참여 신청할 수 없습니다.");
        }

        // 4️⃣ 중복 신청 체크
        int exists =
                recruitJoinMapper.countByPostIdAndUserId(postId, userId);

        if (exists > 0) {
            throw new IllegalStateException("이미 참여 신청한 모집입니다.");
        }

        // 5️⃣ 참여 신청 INSERT
        recruitJoinMapper.insertRecruitJoin(postId, userId);
    }

    /**
     * =========================
     * 🔥 이미 참여한 모집인지 여부 체크
     * =========================
     *
     * - 상세 페이지에서
     *   "참여 신청하기" 버튼 비활성화 판단용
     */
    @Transactional(readOnly = true)
    public boolean isAlreadyJoined(Long postId, String userId) {
        return recruitJoinMapper.countByPostIdAndUserId(postId, userId) > 0;
    }

    /**
     * =========================
     * 🔥 내가 참여한 모집 글의 신청자 ID 목록
     * =========================
     *
     * - 다음 단계에서
     *   작성자 입장 신청자 목록 조회용
     */
    @Transactional(readOnly = true)
    public List<String> getJoinUsersByPostId(Long postId) {
        return recruitJoinMapper.selectJoinUsersByPostId(postId);
    }
}
