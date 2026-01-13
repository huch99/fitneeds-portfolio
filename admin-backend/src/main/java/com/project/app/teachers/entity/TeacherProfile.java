// file: src/main/java/com/project/app/teachers/entity/TeacherProfile.java
package com.project.app.teachers.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "TEACHER_PROFILE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TeacherProfile {

    @Id
    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Column(name = "brch_id", nullable = false)
    private Long brchId;

    @Column(name = "stts_cd", length = 20, nullable = false)
    private String sttsCd; // ACTIVE/RETIRED

    @Column(name = "hire_dt", nullable = false)
    private LocalDate hireDt;

    @Column(name = "leave_dt")
    private LocalDate leaveDt;

    @Column(name = "leave_rsn", length = 255)
    private String leaveRsn;

    @Column(name = "intro", length = 255)
    private String intro;

    @Column(name = "profile_img_url", length = 500)
    private String profileImgUrl;

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
        if (this.sttsCd == null || this.sttsCd.isBlank()) {
            this.sttsCd = "ACTIVE";
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updDt = LocalDateTime.now();
    }

    public void update(Long brchId, String intro, String profileImgUrl, String updUserId) {
        if (brchId != null) this.brchId = brchId;
        if (intro != null) this.intro = intro;
        if (profileImgUrl != null) this.profileImgUrl = profileImgUrl;
        if (updUserId != null) this.updUserId = updUserId;
    }

    public void retire(LocalDate leaveDt, String leaveRsn, String updUserId) {
        this.sttsCd = "RESIGNED";   // ✅ ENUM 허용값
        this.leaveDt = leaveDt;
        this.leaveRsn = (leaveRsn == null) ? "" : leaveRsn;
        this.updUserId = updUserId;
        this.updDt = LocalDateTime.now();
    }
}
