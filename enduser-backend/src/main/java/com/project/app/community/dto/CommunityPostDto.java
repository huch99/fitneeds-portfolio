package com.project.app.community.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.Date;

public class CommunityPostDto {

    private Long postId;
    private String postType;
    private String category;
    private String title;
    private String content;

    /** 작성자 ID */
    private String writerId;

    private String writerType;
    private Long branchId;
    private Integer views;
    private Date createdAt;
    private Date updatedAt;

    // 모집 관련
    private String sportType;
    private Integer recruitMax;

    /** 🔥 현재 참여자 수 (JOIN 결과, DB 컬럼 아님) */
    private Long recruitCount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate recruitEndDate;

    /** 🔥 모집 상태 (Service 계산값) */
    private String recruitStatus;

    private Date displayStart;
    private Date displayEnd;
    private Boolean postVisible;
    private Boolean isVisible;
    private String attachmentPath;

    /** 로그인 사용자 기준 작성자 여부 */
    private Boolean isWriter;

    /* ===== getter / setter ===== */

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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
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

    public Long getRecruitCount() {
        return recruitCount;
    }

    public void setRecruitCount(Long recruitCount) {
        this.recruitCount = recruitCount;
    }


    public LocalDate getRecruitEndDate() {
        return recruitEndDate;
    }

    public void setRecruitEndDate(LocalDate recruitEndDate) {
        this.recruitEndDate = recruitEndDate;
    }

    public String getRecruitStatus() {
        return recruitStatus;
    }

    public void setRecruitStatus(String recruitStatus) {
        this.recruitStatus = recruitStatus;
    }

    public Date getDisplayStart() {
        return displayStart;
    }

    public void setDisplayStart(Date displayStart) {
        this.displayStart = displayStart;
    }

    public Date getDisplayEnd() {
        return displayEnd;
    }

    public void setDisplayEnd(Date displayEnd) {
        this.displayEnd = displayEnd;
    }

    public Boolean getPostVisible() {
        return postVisible;
    }

    public void setPostVisible(Boolean postVisible) {
        this.postVisible = postVisible;
    }

    public Boolean getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(Boolean isVisible) {
        this.isVisible = isVisible;
    }

    public String getAttachmentPath() {
        return attachmentPath;
    }

    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }

    public Boolean getIsWriter() {
        return isWriter;
    }

    public void setIsWriter(Boolean isWriter) {
        this.isWriter = isWriter;
    }
}
