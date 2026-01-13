// file: src/main/java/com/project/app/teachers/entity/TeacherCertificate.java
package com.project.app.teachers.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "TEACHER_CERTIFICATE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TeacherCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cert_id")
    private Long certId;

    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Column(name = "cert_nm", length = 255, nullable = false)
    private String certNm;

    @Column(name = "issuer", length = 255)
    private String issuer;

    @Column(name = "acq_dt")
    private LocalDate acqDt;

    @Column(name = "cert_no", length = 100)
    private String certNo;

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
