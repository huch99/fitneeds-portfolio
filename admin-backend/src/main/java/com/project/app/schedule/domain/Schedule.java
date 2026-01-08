package com.project.app.schedule.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Schedule 도메인 클래스
 * schedule 테이블과 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Schedule {
    private Long schdId;
    private Long brchId;
    private Long progId;
    private String usrId;
    
    // 날짜와 시간을 문자열로 받아 호환성 문제 해결
    private String strtDt;
    private String endDt;
    private String strtTm;
    private String endTm;
    
    private Integer maxNopCnt;
    private Integer rsvCnt;
    private String sttsCd;
    private String description;
    
    private String regDt;
    private String updDt;
}
