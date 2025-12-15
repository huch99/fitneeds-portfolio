package com.project.app.community.dto;

import java.util.Date;

public class CommunityPostDto {

    private Long postId;
    private String postType;
    private String category;
    private String title;
    private String content;

    // 🔥 writerId 타입 통일
    private String writerId;

    private String writerType;
    private Long branchId;
    private Integer views;
    private Date createdAt;
    private Date updatedAt;
    private String sportType;
    private Integer recruitMax;
    private Date recruitDatetime;
    private Date recruitEndDate;
    private Date displayStart;
    private Date displayEnd;
    private Boolean postVisible; // post_visible 기준

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getWriterId() { return writerId; }
    public void setWriterId(String writerId) { this.writerId = writerId; }

    public String getWriterType() { return writerType; }
    public void setWriterType(String writerType) { this.writerType = writerType; }

    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public String getSportType() { return sportType; }
    public void setSportType(String sportType) { this.sportType = sportType; }

    public Integer getRecruitMax() { return recruitMax; }
    public void setRecruitMax(Integer recruitMax) { this.recruitMax = recruitMax; }

    public Date getRecruitDatetime() { return recruitDatetime; }
    public void setRecruitDatetime(Date recruitDatetime) { this.recruitDatetime = recruitDatetime; }

    public Date getRecruitEndDate() { return recruitEndDate; }
    public void setRecruitEndDate(Date recruitEndDate) { this.recruitEndDate = recruitEndDate; }

    public Date getDisplayStart() { return displayStart; }
    public void setDisplayStart(Date displayStart) { this.displayStart = displayStart; }

    public Date getDisplayEnd() { return displayEnd; }
    public void setDisplayEnd(Date displayEnd) { this.displayEnd = displayEnd; }

    public Boolean getPostVisible() { return postVisible; }
    public void setPostVisible(Boolean postVisible) { this.postVisible = postVisible; }
}
