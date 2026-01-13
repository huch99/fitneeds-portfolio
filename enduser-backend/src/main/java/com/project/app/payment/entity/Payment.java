package com.project.app.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;

import com.project.app.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.project.app.reservation.entity.Reservation; // Reservation 엔티티 임포트
import org.springframework.data.annotation.CreatedDate; // CreatedDate 임포트 (JpaAuditing 필요)
import org.hibernate.annotations.UpdateTimestamp; // (만약 LastModifiedDate도 필요하다면)

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PAYMENT", indexes = {
		@Index(name = "idx_payment_user_stts", columnList = "user_id, stts_cd"),
		@Index(name = "idx_payment_pay_type_ref", columnList = "pay_type_cd, target_id")
})
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pay_id", nullable = false)
	private Long payId;

	@Column(name = "ord_no", nullable = false, length = 100, unique = true)
	private String ordNo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "pay_type_cd", nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private PaymentPayTypeCd payTypeCd;

    // --- 추가: target_id 컬럼을 Reservation 엔티티와의 연관 관계로 매핑 ---
    // PAYMENT의 target_id 컬럼이 Reservation의 ID (rsvId)를 참조한다고 가정
    // 단방향 OneToOne 또는 ManyToOne 관계가 될 수 있습니다.
    // 만약 target_id가 모든 Payment에 Reservation을 참조하지 않고 null일 수도 있다면 Optional=true
    @ManyToOne(fetch = FetchType.LAZY) // 또는 @OneToOne (단일 Reservation 참조 시)
    @JoinColumn(name = "target_id", referencedColumnName = "rsv_id", insertable = false, updatable = false)
    // insertable=false, updatable=false는 target_id 컬럼을 매핑에 사용하지만,
    // 이 엔티티의 persist/update 시 해당 컬럼 값을 직접 변경하지 않겠다는 의미입니다.
    // 이는 Payment 엔티티에 target_id 필드가 그대로 남아있고, 이 값을 연관 관계용으로 사용하려 할 때 유용합니다.
    private Reservation reservation;
    // --------------------------------------------------------------------

	@Column(name = "pay_amt", nullable = false, columnDefinition = "DECIMAL(19,4)")
	private BigDecimal payAmt;

	@Column(name = "pay_method", nullable = false, length = 20 )
	@Enumerated(EnumType.STRING)
	private PaymentPayMethod payMethod;

	@Column(name = "stts_cd", nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private PaymentSttsCd sttsCd;

	@CreatedDate // JPA Auditing 설정 필수
    @Column(name = "REG_DT", updatable = false)
    private LocalDateTime regDt;

    // target_id 필드는 DDL에 있으므로 남겨둡니다. (만약 위 연관관계 매핑에서 컬럼을 직접 관리하지 않는다면)
    // 만약 JPA가 target_id 컬럼을 연관 관계로만 관리한다면 이 필드는 필요 없을 수 있습니다.
    // 여기서는 일단 기존 쿼리와의 호환성을 위해 유지하는 방식 (insertable=false, updatable=false)을 사용했습니다.
    // DDL에 있는 target_id는 그대로 둡니다. (주석 처리된 refId를 target_id가 대체한다고 가정)
	@Column(name = "target_id", nullable = false) // DDL에 따라 nullable false 유지
	private Long targetId; // 이 필드를 외래 키로 사용하되, 위에 정의된 `reservation` 객체로 접근

	@Column(name = "target_name", nullable = false, length = 100)
	private String targetName;

    @PrePersist
    public void generateOrderNo() {
        if (this.ordNo == null || this.ordNo.isEmpty()) {
            this.ordNo = "PAYMENT-" + UUID.randomUUID().toString();
        }
        if (this.regDt == null) { // @CreatedDate는 JPA Auditing 설정이 안 되어있을 때 null일 수 있음
            this.regDt = LocalDateTime.now();
        }
    }
}