package com.project.app.ticket.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.app.ticket.dto.TicketResponseDto;
import com.project.app.ticket.entity.Ticket;
import com.project.app.ticket.repository.TicketRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 이용권 서비스 구현 클래스
 * 마이페이지에서 이용권 조회만 가능
 */
@Slf4j
@Service
public class TicketServiceImpl implements TicketService {
	
	private final TicketRepository ticketRepository;
	
	public TicketServiceImpl(TicketRepository ticketRepository) {
		this.ticketRepository = ticketRepository;
	}
	
	@Override
	public List<TicketResponseDto> getMyTickets(String userId) {
		List<Ticket> tickets = ticketRepository.findByUser_UserId(userId);
		return tickets.stream()
				.map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}
	
	private TicketResponseDto convertToResponseDto(Ticket ticket) {
		return TicketResponseDto.builder()
				.ticketId(ticket.getTicketId())
				.ticketType(ticket.getTicketType())
				.remainingCount(ticket.getRemainingCount())
				.expiryDate(ticket.getExpiryDate())
				.build();
	}
}

