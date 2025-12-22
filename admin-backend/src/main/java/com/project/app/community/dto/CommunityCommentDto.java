package com.project.app.community.dto;

import java.time.LocalDateTime;

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

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getWriterId() {
        return writerId;
    }

    public void setWriterId(String writerId) {
        this.writerId = writerId;
    }

    public String getWriterType() {
        return writerType;
    }

    public void setWriterType(String writerType) {
        this.writerType = writerType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getCommentVisible() {
        return commentVisible;
    }

    public void setCommentVisible(Integer commentVisible) {
        this.commentVisible = commentVisible;
    }
}
