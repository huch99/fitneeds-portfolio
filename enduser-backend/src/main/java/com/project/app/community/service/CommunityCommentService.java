package com.project.app.community.service;

import com.project.app.community.dto.CommunityCommentDto;
import com.project.app.community.mapper.CommunityCommentMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityCommentService {

    private final CommunityCommentMapper communityCommentMapper;

    public CommunityCommentService(CommunityCommentMapper communityCommentMapper) {
        this.communityCommentMapper = communityCommentMapper;
    }

    /**
     * USER 댓글 목록 조회
     * - 특정 게시글(postId)에 대한 댓글
     * - 관리자에 의해 숨김 처리되지 않은 댓글만 반환
     */
    public List<CommunityCommentDto> getVisibleCommentsByPostId(Long postId) {
        return communityCommentMapper.selectVisibleCommentsByPostId(postId);
    }
}
