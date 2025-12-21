package com.project.app.ticket.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.project.app.user.entity.User;

/**
 * 이용권 엔티티
 * 사용자가 보유한 이용권 정보
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "TICKET")
public class Ticket {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tkt_id")
	private Long ticketId;
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "user_id", nullable = false)
	private User user;
	
	@Column(name = "ticket_type")
	private String ticketType; // 이용권 종류
	
	@Column(name = "remaining_count")
	private Integer remainingCount; // 남은 횟수
	
	@Column(name = "expiry_date")
	private LocalDateTime expiryDate; // 만료일
	
	// 추가 필드들은 실제 이용권 테이블 구조에 맞게 추가 필요
}

