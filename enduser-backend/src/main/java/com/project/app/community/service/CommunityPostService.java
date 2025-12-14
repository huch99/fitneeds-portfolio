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

        // ===== 필수값 방어 =====
        if (dto.getTitle() == null || dto.getContent() == null || dto.getWriterId() == null) {
            throw new IllegalArgumentException("필수값 누락 (title, content, writerId)");
        }

        // ===== USER 고정 규칙 =====
        dto.setPostType("COMMUNITY");
        dto.setWriterType("MEMBER");
        dto.setIsVisible(true);
        dto.setPostVisible(true);
        dto.setViews(0);

        int result = communityPostMapper.insertCommunityPost(dto);

        if (result != 1) {
            throw new IllegalStateException("커뮤니티 글 등록 실패");
        }
    }

    /**
     * USER 커뮤니티 글 목록 조회
     */
    @Transactional(readOnly = true)
    public List<CommunityPostDto> getVisibleCommunityPostList() {
        return communityPostMapper.selectVisibleCommunityPostList();
    }
}
