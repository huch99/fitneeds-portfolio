package com.project.app.community.controller;

import com.project.app.community.dto.CommunityCommentDto;
import com.project.app.community.service.CommunityCommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/comments")
public class CommunityCommentController {

    private final CommunityCommentService communityCommentService;

    public CommunityCommentController(CommunityCommentService communityCommentService) {
        this.communityCommentService = communityCommentService;
    }

    /**
     * USER 댓글 목록 조회
     * - 특정 게시글(postId)에 대한 댓글
     * - comment_visible = 1 인 댓글만 반환
     */
    @GetMapping("/{postId}")
    public List<CommunityCommentDto> getVisibleComments(
            @PathVariable("postId") Long postId
    ) {
        return communityCommentService.getVisibleCommentsByPostId(postId);
    }
}
