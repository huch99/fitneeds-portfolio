package com.project.app.payment.entity;

import java.time.LocalDateTime;

import com.project.app.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "payment")
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pay_id", nullable = false)
	private Long payId;
	
	@Column(name = "ord_no", nullable = false, unique = true, length = 100)
	private String ordNo;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usr_id", nullable = false)
	private User user;
	
	@Column(name = "pay_type_cd", nullable = false, length = 20)
	private String payTypeCd;
	
	@Column(name = "ref_id", nullable = true)
	private Long refId;
	
	@Column(name = "pay_amt", nullable = false)
	private Integer payAmt;
	
	@Column(name = "pay_method", nullable = false, length = 20)
	private String payMethod;
	
	@Column(name = "stts_cd", nullable = false, length = 20)
	private String sttsCd;
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime regDt;
}

