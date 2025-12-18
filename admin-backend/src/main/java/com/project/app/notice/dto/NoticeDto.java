package com.project.app.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDto {

    private Long postId;
    private String postType;     // NOTICE

    private String title;
    private String content;

    private String writerId;
    private String writerType;   // STAFF

    private Long branchId;
    private Integer views;

    private Boolean isVisible;   // ✅ 공지사항 숨김/보이기 전용

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
