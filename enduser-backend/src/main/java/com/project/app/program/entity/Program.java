package com.project.app.program.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.project.app.sporttype.entity.SportType;

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
@Table(name = "PROGRAM")
public class Program {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "prog_id", nullable = false)
	private Long progId;			// 프로그램 ID
	
	@Column(name = "prog_nm", nullable = false, length = 255)
	private String progNm;			// 프로그램 명
	
	@ManyToOne
	@JoinColumn(name = "sport_id", nullable = false)
	private SportType sportType;	// 종목 ID, FK
	
	@Column(name = "use_yn", nullable = true, columnDefinition = "TINYINT(1)")
	@ColumnDefault("1")
	private boolean useYn;			// 사용 여부
	
	@Column(name = "one_time_amt", nullable = false)
	@ColumnDefault("0")
	private Integer oneTimeAmt;		// 단건 결제 금액
	
	@Column(name = "rwd_game_pnt", nullable = false)
	@ColumnDefault("0")
	private Integer rwdGamePnt;		//게이미케이션 포인트
	
	@Column(name = "reg_dt", nullable = false)
	@CreatedDate
	private LocalDateTime regDt;	// 등록 일시 (로그 확인용)
	
	@Column(name = "upd_dt", nullable = false)
	@LastModifiedDate
	private LocalDateTime updDt;	// 수정 일지 (로그 확인용)
	
}
