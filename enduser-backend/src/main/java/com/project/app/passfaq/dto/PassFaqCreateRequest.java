package com.project.app.passfaq.dto;

import lombok.Data;

@Data
public class PassFaqCreateRequest {
    private String title;
    private String content;
    private String category;
}
