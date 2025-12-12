package com.project.app.board.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // getter, setter, equals, hashCode, toString 자동 생성
@NoArgsConstructor      // 파라미터 없는 기본 생성자
@AllArgsConstructor     // 모든 필드를 파라미터로 받는 생성자
@Builder                // 빌더 패턴 구현
public class BoardDto {
    private Long id;
    private String no;
    private String title;
    private String content;
    private String author;
    private Date createDate;
    private Date updateDate;
    private Date endDate;
    private Integer viewCount;
    private String category;
}
