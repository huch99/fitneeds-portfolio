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
     * ADMIN 커뮤니티 목록 조회 (기존 유지)
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
     * ADMIN 커뮤니티 전체 개수 (기존 유지)
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
     * ✅ ADMIN 커뮤니티 목록 조회 (페이징 전용)
     * - 기본: 숨김글 포함
     */
    public AdminPagedResult<CommunityPostDto> getCommunityPostPaged(
            String category,
            String keyword,
            Integer visible,
            String orderType,
            int page
    ) {
        int offset = (page - 1) * PAGE_SIZE;

        List<CommunityPostDto> list =
                adminCommunityMapper.selectCommunityPostList(
                        category,
                        keyword,
                        visible,
                        orderType,
                        PAGE_SIZE,
                        offset
                );

        int totalCount =
                adminCommunityMapper.selectCommunityPostCount(
                        category,
                        keyword,
                        visible
                );

        int totalPages = (int) Math.ceil((double) totalCount / PAGE_SIZE);

        return new AdminPagedResult<>(
                list,
                page,
                totalPages,
                totalCount
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

    /**
     * ✅ ADMIN 전용 페이징 결과 클래스
     * - import 문제 방지용
     */
    public static class AdminPagedResult<T> {
        private List<T> list;
        private int currentPage;
        private int totalPages;
        private int totalCount;

        public AdminPagedResult(List<T> list, int currentPage, int totalPages, int totalCount) {
            this.list = list;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.totalCount = totalCount;
        }

        public List<T> getList() {
            return list;
        }

        public int getCurrentPage() {
            return currentPage;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public int getTotalCount() {
            return totalCount;
        }
    }
}
