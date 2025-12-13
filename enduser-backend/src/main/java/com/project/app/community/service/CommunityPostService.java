package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityPostService {

    private final CommunityPostMapper communityPostMapper;

    public CommunityPostService(CommunityPostMapper communityPostMapper) {
        this.communityPostMapper = communityPostMapper;
    }

    /**
     * USER 커뮤니티 글 등록
     */
    @Transactional
    public void createCommunityPost(CommunityPostDto dto) {

        // ===== USER 고정 비즈니스 규칙 =====
        dto.setPostType("COMMUNITY");   // USER는 COMMUNITY만
        dto.setWriterType("MEMBER");    // USER 작성자
        dto.setIsVisible(true);         // 기본 노출
        dto.setViews(0);                // 조회수 0부터

        communityPostMapper.insertCommunityPost(dto);
    }

    /**
     * USER 커뮤니티 글 목록 조회
     * - COMMUNITY 타입
     * - 노출(is_visible = true)만
     * - 최신순
     */
    @Transactional(readOnly = true)
    public List<CommunityPostDto> getVisibleCommunityPostList() {
        return communityPostMapper.selectVisibleCommunityPostList();
    }
}
