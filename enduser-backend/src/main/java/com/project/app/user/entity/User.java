package com.project.app.user.entity; // 패키지 변경

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data  // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 포함
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
	@Id
    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;
    
	@Column(name = "email")
    private String email;
	
    @Column(name = "user_name", nullable = false)
    private String userName;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "role")
    private String auth;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "agree_at")
    private LocalDateTime agreeAt;
    
    @Column(name = "brch_id")
    private Long brchId;
    
    public User(String userId, String password, String userName) {
        this.userId = userId;
        this.password = password;
        this.userName = userName;
    }
}