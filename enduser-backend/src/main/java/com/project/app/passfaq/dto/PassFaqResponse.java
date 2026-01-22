package com.project.app.passfaq.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PassFaqResponse {

    private Long id;            // faqId
    private String title;
    private String content;
    private String answer;      // content와 분리된 관리자 답변
    private String status;      // WAIT / DONE
    private String category;
    private LocalDateTime createdAt;
}
