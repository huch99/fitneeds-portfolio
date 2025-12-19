package com.project.app.ticket.service;

import java.util.List;

import com.project.app.ticket.dto.TicketResponseDto;

/**
 * 이용권 서비스 인터페이스
 * 마이페이지에서 이용권 조회만 가능
 */
public interface TicketService {
	/**
	 * 사용자 ID로 이용권 목록 조회 (마이페이지용)
	 */
	List<TicketResponseDto> getMyTickets(String userId);
}

