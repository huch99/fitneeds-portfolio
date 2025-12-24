package com.project.app.schedule.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.app.admin.entity.UserAdmin;
import com.project.app.program.entity.Program;

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

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SCHEDULE")
public class Schedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schd_id", nullable = false)
	private Long schdId;			// 스케줄 ID
	
	@ManyToOne
	@JoinColumn(name = "prog_id", nullable = false)
	private Program program;		// 프로그램 ID
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserAdmin userAdmin;	// 유저(어드민 - 강사) ID
	
	@Column(name = "strt_dt", nullable = false)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate strtDt;		// 시작 날짜
	
	@Column(name = "end_dt", nullable = false)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate endDt;		// 종료 날짜
	
	@Column(name = "strt_tm", nullable = false)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	private LocalTime strtTm;		// 시작 시간
	
	@Column(name = "end_tm", nullable = false)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	private LocalTime endTm;		// 종료 시간
	
	@Column(name = "max_nop_cnt", nullable = false)
	private Integer maxNopCnt;		// 최대 정원
	
	@Column(name = "rsv_cnt", nullable = false)
	@ColumnDefault("0")
	private Integer rsvCnt;			// 현재 인원
	
	@Column(name = "stts_cd", nullable = false, length = 20)
	private String sttsCd;			// 상태 코드
	
	@Column(name = "description", nullable = true, columnDefinition = "TEXT")
	private String description;
	
	@Column(name = "reg_dt", nullable = false)
	@CreatedDate
	private LocalDateTime regDt;
	
	@Column(name = "upd_dt", nullable = false)
	@LastModifiedDate
	private LocalDateTime updDt;
	
}
