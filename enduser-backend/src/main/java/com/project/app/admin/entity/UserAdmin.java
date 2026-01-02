package com.project.app.admin.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import com.project.app.branch.entity.Branch;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USERS_ADMIN") // USER는 예약어이므로 'USERS' 사용
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 포함
@NoArgsConstructor
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 (Builder 사용 시 내부적으로 활용)
@Builder // Builder 패턴 제공
public class UserAdmin {

	@Id
	@Column(name = "user_id", nullable = false, length = 50)
	private String userId;

	@Column(name = "user_name", nullable = false, length = 100)
	private String userName;

	@Column(name = "email", nullable = false, unique = true, length = 255)
	private String email;

	@Column(name = "password", nullable = false, length = 255)
	private String password;

	@Column(name = "phone_number", nullable = true, length = 20)
	private String phoneNumber;

	@ColumnDefault("'USER'") // 문자열은 작은따옴표로 감싸야 함
	@Column(name = "role", nullable = false)
	private String role; // USER, ADMIN, MANAGER, ETC....

	@ColumnDefault("1") // 1 = TRUE
	@Column(name = "is_active", nullable = false, columnDefinition = "TINYINT(1)")
	private Boolean isActive; // String -> Boolean 타입으로 변경

	@Column(name = "agree_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime agreeAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "brch_id", nullable = true)
	private Branch brchId;
}
