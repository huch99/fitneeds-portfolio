package com.project.app.reservation.entity;

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

import com.project.app.schedule.entity.Schedule;
import com.project.app.ticket.entity.Ticket;
import com.project.app.user.entity.User;

/**
 * 예약 엔티티
 * 실제 데이터베이스 테이블 구조에 맞춘 엔티티
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservation")
public class Reservation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rsv_id")
	private Long reservationId;
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "user_id", nullable = true)
	private User user;
	
	@Column(name = "usr_id", insertable = false, updatable = false)
	private String userId; // 직접 ID 참조용
	
	@ManyToOne
	@JoinColumn(name = "schd_id", nullable = true)
	private Schedule schedule;
	
	@Column(name = "schd_id", insertable = false, updatable = false)
	private Long scheduleId; // 직접 ID 참조용
	
	@ManyToOne
	@JoinColumn(name = "tkt_id", nullable = true)
	private Ticket ticket; // 이용권 (선택적)
	
	@Column(name = "tkt_id", insertable = false, updatable = false)
	private Long ticketId; // 직접 ID 참조용
	
	@Column(name = "stts_cd", nullable = false)
	private String statusCode; // 상태코드: RESERVED, CANCELLED, COMPLETED 등
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime registrationDateTime; // 등록일시
	
	@Column(name = "cncl_rsn", length = 255)
	private String cancelReason; // 취소/변경사유 (관리자용)
	
	@Column(name = "mod_usr_ID", length = 50)
	private String modifyUserId; // 수정자ID
	
	@Column(name = "rsv_dt", nullable = false)
	private LocalDateTime reservedDate; // 예약날짜 (사용자 선택날짜) - 실제 테이블: rsv_dt (DATE)
	
	@Column(name = "rsv_time", nullable = false)
	private java.time.LocalTime reservedTime; // 예약시간 - 실제 테이블: rsv_time (TIME)
}

