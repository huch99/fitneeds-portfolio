package com.project.app.review.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // getter, setter, equals, hashCode, toString 자동 생성
@NoArgsConstructor      // 파라미터 없는 기본 생성자
@AllArgsConstructor     // 모든 필드를 파라미터로 받는 생성자
@Builder                // 빌더 패턴 구현
public class ReviewDto {
    private Long reviewId;          // rvw_id: 리뷰 ID
    private Long reservationId;     // rsv_id: 예약 ID
    private Integer rating;          // rating: 별점
    private String content;          // content: 후기 내용
    private Long instructorId;       // inst_id: 강사 ID
    private LocalDateTime registrationDateTime; // reg_dt: 작성일
}

