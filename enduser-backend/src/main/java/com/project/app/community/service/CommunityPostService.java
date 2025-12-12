package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
