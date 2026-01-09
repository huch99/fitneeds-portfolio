package com.project.app.payment.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Payment 도메인 클래스
 * payment 테이블과 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @JsonProperty("pay_id")
    private Long payId;
    
    @JsonProperty("order_no")
    private String orderNo;
    
    @JsonProperty("brch_id")
    private Long brchId;
    
    @JsonProperty("usr_id")
    private String usrId;
    
    @JsonProperty("pay_type_cd")
    private String payTypeCd;
    
    @JsonProperty("ref_id")
    private Long refId;
    
    @JsonProperty("pay_amt")
    private Integer payAmt;
    
    @JsonProperty("pay_method")
    private String payMethod;
    
    @JsonProperty("stts_cd")
    private String sttsCd;
    
    @JsonProperty("reg_dt")
    private String regDt;
    
    @JsonProperty("pg_order_no")
    private String pgOrderNo;
}
