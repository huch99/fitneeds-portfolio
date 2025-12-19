package com.project.app.ticket.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이용권 응답 DTO
 * 마이페이지에서 사용할 이용권 정보
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDto {
	private Long ticketId;
	private String ticketType; // 이용권 종류 (PERIOD, COUNT 등)
	private Integer remainingCount; // 남은 횟수
	private LocalDateTime expiryDate; // 만료일
}

