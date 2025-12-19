package com.project.app.ticket.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
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
	 * 현재 인증된 사용자의 userId를 가져옵니다.
	 * JWT 토큰에서 추출된 사용자 정보를 사용합니다.
	 */
	private String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null) {
			log.error("SecurityContext에 인증 정보가 없습니다.");
			throw new RuntimeException("인증되지 않은 사용자입니다.");
		}
		if (!authentication.isAuthenticated()) {
			log.error("인증되지 않은 사용자입니다. Authentication: {}", authentication);
			throw new RuntimeException("인증되지 않은 사용자입니다.");
		}
		String userId = authentication.getName();
		log.debug("현재 인증된 사용자 ID: {}", userId);
		return userId; // JWT 토큰의 subject (userId)
	}
	
	/**
	 * 나의 이용권 목록 조회 (마이페이지)
	 * GET /api/ticket/my
	 * 헤더: Authorization: Bearer {token}
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyTickets() {
		try {
			// 인증된 사용자의 이용권 목록만 조회
			String currentUserId = getCurrentUserId();
			List<TicketResponseDto> tickets = ticketService.getMyTickets(currentUserId);
			return ResponseEntity.ok(tickets);
		} catch (Exception e) {
			log.error("이용권 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("이용권 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}

