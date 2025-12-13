package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.AdminCommunityMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCommunityService {

    private final AdminCommunityMapper adminCommunityMapper;

    public AdminCommunityService(AdminCommunityMapper adminCommunityMapper) {
        this.adminCommunityMapper = adminCommunityMapper;
    }

    /**
     * ADMIN 커뮤니티 글 목록 조회
     */
    public List<CommunityPostDto> getCommunityPostList() {
        return adminCommunityMapper.selectCommunityPostList();
    }

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     *
     * @param postId 게시글 ID
     * @param postVisible true = 보이기, false = 숨기기
     */
    public void updatePostVisible(Long postId, Boolean postVisible) {
        adminCommunityMapper.updatePostVisible(postId, postVisible);
    }
 // ✅ ADMIN 삭제
    public void deleteCommunityPost(Long postId) {
        adminCommunityMapper.deleteCommunityPost(postId);
    }
}
