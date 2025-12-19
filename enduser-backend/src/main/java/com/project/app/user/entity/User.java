package com.project.app.user.entity; // 패키지 변경

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USER")  // ⚠️ 주의: USER는 DB 예약어이므로 위험할 수 있음
// 권장: @Table(name = "users") - 하지만 기존 DB 스키마가 USER이므로 일단 유지
// 변경 시 DB 마이그레이션 필요: ALTER TABLE USER RENAME TO users;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "userId", nullable = false, length = 50)
    private String userId;

    @Column(name = "email")
    private String email;

    @Column(name = "userName", nullable = false)
    private String userName;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "auth")
    private String auth;
}
