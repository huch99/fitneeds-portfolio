package com.project.app.community.service;

import com.project.app.community.dto.CommunityCommentDto;
import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostDetailMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityPostDetailService {

    private final CommunityPostDetailMapper mapper;

    public CommunityPostDetailService(CommunityPostDetailMapper mapper) {
        this.mapper = mapper;
    }

    /**
     * 게시글 상세 조회 (USER)
     */
    public CommunityPostDto getVisiblePostDetail(Long postId) {
        return mapper.selectVisiblePostDetail(postId);
    }

    /**
     * 댓글 목록 조회 (USER)
     */
    public List<CommunityCommentDto> getVisibleCommentsByPostId(Long postId) {
        return mapper.selectVisibleCommentsByPostId(postId);
    }

    /**
     * 댓글 작성 (USER)
     * ⚠️ 로그인 연동 전 임시 처리
     */
    public void createComment(Long postId, CommunityCommentDto commentDto) {
        commentDto.setPostId(postId);

        // 🔽 임시 사용자 정보 (로그인 연동 전)
        commentDto.setWriterId(1L);               // 임시 회원 ID
        commentDto.setWriterType("MEMBER");       // 회원 고정

        mapper.insertComment(commentDto);
    }
}
