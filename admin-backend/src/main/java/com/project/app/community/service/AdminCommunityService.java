package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.AdminCommunityMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCommunityService {

    private static final int PAGE_SIZE = 10;

    private final AdminCommunityMapper adminCommunityMapper;

    public AdminCommunityService(AdminCommunityMapper adminCommunityMapper) {
        this.adminCommunityMapper = adminCommunityMapper;
    }

    /**
     * ADMIN 커뮤니티 목록 조회 (페이징)
     *
     * @param category 카테고리
     * @param keyword  검색어
     * @param visible  노출 여부 (1: 보이기, 0: 숨김, null: 전체)
     * @param orderType 정렬 기준 (views / comments / null)
     * @param page 페이지 번호 (1부터 시작)
     */
    public List<CommunityPostDto> getCommunityPostList(
            String category,
            String keyword,
            Integer visible,
            String orderType,
            int page
    ) {
        int offset = (page - 1) * PAGE_SIZE;

        return adminCommunityMapper.selectCommunityPostList(
                category,
                keyword,
                visible,
                orderType,
                PAGE_SIZE,
                offset
        );
    }

    /**
     * ADMIN 커뮤니티 전체 개수 (페이징용)
     */
    public int getCommunityPostCount(
            String category,
            String keyword,
            Integer visible
    ) {
        return adminCommunityMapper.selectCommunityPostCount(
                category,
                keyword,
                visible
        );
    }

    /**
     * ADMIN 커뮤니티 게시글 상세 조회
     */
    public CommunityPostDto getCommunityPostDetail(Long postId) {
        return adminCommunityMapper.selectCommunityPostDetail(postId);
    }

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     */
    public void updatePostVisible(Long postId, Boolean postVisible) {
        adminCommunityMapper.updatePostVisible(postId, postVisible);
    }

    /**
     * ADMIN 커뮤니티 글 삭제
     */
    public void deleteCommunityPost(Long postId) {
        adminCommunityMapper.deleteCommunityPost(postId);
    }
}
