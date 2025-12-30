package com.project.app.admin.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import com.project.app.branch.entity.Branch;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "USERS_ADMIN")
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
	
	@Column(name = "role", nullable = false, length = 50)
	@Enumerated(EnumType.STRING)
	@ColumnDefault("'USER'")
	private UserAdminRole role;
	
	@Column(name = "is_active", nullable = false, columnDefinition = "TINYINT(1)")
	@ColumnDefault("1")
	private boolean isActive = true;
	
	@Column(name = "agree_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime agreeAt;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "brch_id", nullable = true)
	private Branch branch;
}
