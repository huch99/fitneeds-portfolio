package com.project.app.ticket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.ticket.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
	Optional<Ticket> findByTicketId(Long ticketId);
	
	/**
	 * 사용자 ID로 이용권 목록 조회 (마이페이지용)
	 */
	List<Ticket> findByUser_UserId(String userId);
}

