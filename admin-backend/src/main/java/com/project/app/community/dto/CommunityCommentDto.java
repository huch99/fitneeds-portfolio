package com.project.app.community.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommunityCommentDto {

    private Long commentId;
    private Long postId;

    /**
     * 작성자 식별자
     * - USER  : userId (ex: user1, user23)
     * - STAFF : staffId (ex: staff3, admin1)
     */
    private String writerId;

    /**
     * 작성자 타입
     * - USER
     * - STAFF
     */
    private String writerType;

    private String content;
    private LocalDateTime createdAt;

    /**
     * 댓글 노출 여부
     * 1 : 노출
     * 0 : 숨김
     */
    private Integer commentVisible;
}
