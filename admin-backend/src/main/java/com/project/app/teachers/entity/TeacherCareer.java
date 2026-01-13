// file: src/main/java/com/project/app/teachers/entity/TeacherCareer.java
package com.project.app.teachers.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "TEACHER_CAREER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TeacherCareer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_id")
    private Long careerId;

    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Column(name = "org_nm", length = 255, nullable = false)
    private String orgNm;

    @Column(name = "role_nm", length = 255)
    private String roleNm;

    @Column(name = "strt_dt", nullable = false)
    private LocalDate strtDt;

    @Column(name = "end_dt")
    private LocalDate endDt;

    @Column(name = "reg_dt", nullable = false)
    private LocalDateTime regDt;

    @Column(name = "upd_dt", nullable = false)
    private LocalDateTime updDt;

    @Column(name = "upd_user_id", length = 50)
    private String updUserId;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.regDt = (this.regDt == null) ? now : this.regDt;
        this.updDt = (this.updDt == null) ? now : this.updDt;
    }

    @PreUpdate
    void onUpdate() {
        this.updDt = LocalDateTime.now();
    }
}
