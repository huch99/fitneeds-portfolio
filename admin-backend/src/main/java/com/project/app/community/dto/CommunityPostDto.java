package com.project.app.community.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
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

    // post_visible 기준
    private Boolean postVisible;

    // ✅ [추가] ADMIN 모집 참여자 목록
    private List<RecruitUserDto> recruitUsers;
}
