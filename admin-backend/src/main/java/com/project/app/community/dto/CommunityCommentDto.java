package com.project.app.community.dto;

import java.time.LocalDateTime;

public class CommunityCommentDto {

    private Long commentId;
    private Long postId;
    private Long writerId;
    private String writerType;
    private String content;
    private LocalDateTime createdAt;
    private Integer commentVisible; // 1: 보임, 0: 숨김

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

    public Long getWriterId() {
        return writerId;
    }

    public void setWriterId(Long writerId) {
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
