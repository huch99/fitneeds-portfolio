package com.project.app.ticket.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.ticket.dto.TicketResponseDto;
import com.project.app.ticket.service.TicketService;

import lombok.extern.slf4j.Slf4j;

/**
 * 이용권 컨트롤러
 * 마이페이지에서 이용권 조회만 가능
 * 모든 API는 JWT 인증 토큰이 필요합니다.
 * Authorization 헤더에 "Bearer {token}" 형식으로 토큰을 포함해야 합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/ticket")
public class TicketController {
	
	private final TicketService ticketService;
	
	public TicketController(TicketService ticketService) {
		this.ticketService = ticketService;
	}
	
	/**
	 * 요청 헤더에서 사용자 ID를 가져옵니다.
	 * 프론트엔드의 localStorage에서 가져온 userId가 X-User-Id 헤더로 전달됩니다.
	 * 
	 * @param request HTTP 요청 객체
	 * @return 사용자 ID
	 */
	private String getCurrentUserId(HttpServletRequest request) {
		String userId = request.getHeader("X-User-Id");
		if (userId == null || userId.isEmpty()) {
			log.error("X-User-Id 헤더가 없습니다. localStorage에서 userId를 확인해주세요.");
			throw new RuntimeException("사용자 ID가 없습니다.");
		}
		log.debug("현재 사용자 ID (localStorage에서 가져옴): {}", userId);
		return userId;
	}
	
	/**
	 * 나의 이용권 목록 조회 (마이페이지)
	 * GET /api/ticket/my
	 * 헤더: Authorization: Bearer {token}
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyTickets(HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 이용권 목록 조회
			String currentUserId = getCurrentUserId(request);
			List<TicketResponseDto> tickets = ticketService.getMyTickets(currentUserId);
			return ResponseEntity.ok(tickets);
		} catch (Exception e) {
			log.error("이용권 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("이용권 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}

