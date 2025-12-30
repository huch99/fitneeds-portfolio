package com.project.app.community.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CommunityCommentDto {

    private Long commentId;
    private Long postId;
    private String writerId;
    private String writerType;
    private String content;
    private LocalDateTime createdAt;
}
