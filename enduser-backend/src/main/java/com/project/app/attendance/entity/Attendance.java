package com.project.app.attendance.entity;

import java.time.LocalDate;
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

import com.project.app.reservation.entity.Reservation;
import com.project.app.ticket.entity.Ticket;
import com.project.app.user.entity.User;

/**
 * 출석 엔티티
 * 예약한 내용을 토대로 출석현황을 관리하는 테이블
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ATTENDANCE")
public class Attendance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "att_id")
	private Long attendanceId;
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "userId", nullable = false)
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "rsv_id", nullable = true)
	private Reservation reservation; // 예약ID (선택적)
	
	@ManyToOne
	@JoinColumn(name = "tkt_id", nullable = false)
	private Ticket ticket; // 사용한 이용권 ID
	
	@Column(name = "prod_id", nullable = false)
	private Long productId; // 이용권 상품ID
	
	@Column(name = "att_dt", nullable = false)
	private LocalDate attendanceDate; // 출석일
	
	@Column(name = "att_stts_cd", nullable = false, length = 20)
	private String attendanceStatusCode; // 출석상태: ATTEND, ABSENT, CANCEL
	
	@Column(name = "mod_dt")
	private LocalDateTime modifyDateTime; // 수정일시
	
	@Column(name = "mod_usr_id", length = 50)
	private String modifyUserId; // 수정자ID
}

