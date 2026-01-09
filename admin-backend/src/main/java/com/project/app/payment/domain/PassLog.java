package com.project.app.payment.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * PassLog 도메인 클래스
 * pass_log 테이블과 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassLog {
    @JsonProperty("pass_log_id")
    private Long passLogId;
    
    @JsonProperty("user_pass_id")
    private Long userPassId;
    
    @JsonProperty("brch_id")
    private Long brchId;
    
    @JsonProperty("chg_type_cd")
    private String chgTypeCd;
    
    @JsonProperty("chg_cnt")
    private Integer chgCnt;
    
    @JsonProperty("chg_rsn")
    private String chgRsn;
    
    @JsonProperty("usr_id")
    private String usrId;
    
    @JsonProperty("reg_dt")
    private String regDt;
}
