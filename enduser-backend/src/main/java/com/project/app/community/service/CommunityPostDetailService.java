package com.project.app.community.service;

import com.project.app.community.dto.CommunityCommentDto;
import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostDetailMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommunityPostDetailService {

    private final CommunityPostDetailMapper mapper;

    public CommunityPostDetailService(CommunityPostDetailMapper mapper) {
        this.mapper = mapper;
    }

    /**
     * 게시글 상세 조회 (USER)
     * - 모집 글인 경우 모집 상태(recruitStatus) 자동 계산
     * - 🔥 로그인 사용자 기준 작성자 여부 계산
     */
    @Transactional(readOnly = true)
    public CommunityPostDto getVisiblePostDetail(Long postId, String loginUserId) {

        CommunityPostDto post = mapper.selectVisiblePostDetail(postId);

        if (post == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        // 🔥 모집 상태 자동 계산
        if ("모집".equals(post.getCategory())
                && post.getRecruitEndDate() != null) {

            LocalDate today = LocalDate.now();

            if (post.getRecruitEndDate().isBefore(today)) {
                post.setRecruitStatus("모집종료");
            } else {
                post.setRecruitStatus("모집중");
            }
        }

        // 🔥 작성자 여부 판단 (핵심)
        if (loginUserId != null && post.getWriterId() != null) {
            post.setIsWriter(
                loginUserId.equals(String.valueOf(post.getWriterId()))
            );
        } else {
            post.setIsWriter(false);
        }

        return post;
    }

    /**
     * 댓글 목록 조회 (USER)
     */
    @Transactional(readOnly = true)
    public List<CommunityCommentDto> getVisibleCommentsByPostId(Long postId) {
        return mapper.selectVisibleCommentsByPostId(postId);
    }

    /**
     * 댓글 작성 (USER)
     */
    @Transactional
    public void createComment(Long postId, CommunityCommentDto commentDto) {
        commentDto.setPostId(postId);
        mapper.insertComment(commentDto);
    }
}
