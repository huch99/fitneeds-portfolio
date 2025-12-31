package com.project.app.reservation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.project.app.schedule.entity.Schedule;
import com.project.app.user.entity.User;
import com.project.app.userpass.entity.UserPass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RESERVATION")
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rsv_id", nullable = false)
	private Long rsvId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "schd_id", nullable = false)
	private Schedule schedule;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_pass_id", nullable = true)
	private UserPass userPass;
	
	@Column(name = "stts_cd", nullable = false)
	@Enumerated(EnumType.STRING)
	private RsvSttsCd sttsCd;
	
	@Column(name = "rsv_dt", nullable = false)
	private LocalDate rsvDt;
	
	@Column(name = "rsv_time", nullable = false)
	private LocalTime rsvTime;
	
	@Column(name = "reg_dt", nullable = false)
	@CreatedDate
	private LocalDateTime regDt;
	
	@Column(name = "upd_dt", nullable = false)
	@LastModifiedDate
	private LocalDateTime updDt;
	
	@Column(name = "cncl_rsn", nullable = true, length = 255)
	private String cnclRsn;
	
	@Column(name = "upd_id", nullable = true)
	private String updID;
}
