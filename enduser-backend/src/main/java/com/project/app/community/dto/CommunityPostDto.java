package com.project.app.community.dto;

import java.time.LocalDateTime;

public class CommunityPostDto {

    // ===== 공통 =====
    private Long postId;
    private String postType;      // COMMUNITY / NOTICE / FAQ
    private String category;      // 자유 / 모집
    private String title;
    private String content;

    // ===== 작성자 =====
    private Long writerId;        // MEMBER.MBR_ID
    private String writerType;    // MEMBER / STAFF

    // ===== 지점 =====
    private Long branchId;        // 공지사항용 (USER 커뮤니티는 null 가능)

    // ===== 조회/상태 =====
    private Integer views;
    private Boolean isVisible;

    // ===== 모집글 전용 =====
    private String sportType;
    private Integer recruitMax;
    private LocalDateTime recruitDatetime;
    private LocalDateTime recruitEndDate;

    // ===== 공지 노출 =====
    private LocalDateTime displayStart;
    private LocalDateTime displayEnd;

    // ===== 시간 =====
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* =======================
       Getter / Setter
     ======================= */

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getPostType() {
        return postType;
    }

    public void setPostType(String postType) {
        this.postType = postType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Boolean getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(Boolean isVisible) {
        this.isVisible = isVisible;
    }

    public String getSportType() {
        return sportType;
    }

    public void setSportType(String sportType) {
        this.sportType = sportType;
    }

    public Integer getRecruitMax() {
        return recruitMax;
    }

    public void setRecruitMax(Integer recruitMax) {
        this.recruitMax = recruitMax;
    }

    public LocalDateTime getRecruitDatetime() {
        return recruitDatetime;
    }

    public void setRecruitDatetime(LocalDateTime recruitDatetime) {
        this.recruitDatetime = recruitDatetime;
    }

    public LocalDateTime getRecruitEndDate() {
        return recruitEndDate;
    }

    public void setRecruitEndDate(LocalDateTime recruitEndDate) {
        this.recruitEndDate = recruitEndDate;
    }

    public LocalDateTime getDisplayStart() {
        return displayStart;
    }

    public void setDisplayStart(LocalDateTime displayStart) {
        this.displayStart = displayStart;
    }

    public LocalDateTime getDisplayEnd() {
        return displayEnd;
    }

    public void setDisplayEnd(LocalDateTime displayEnd) {
        this.displayEnd = displayEnd;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
