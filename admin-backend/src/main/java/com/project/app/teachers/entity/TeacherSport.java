// file: src/main/java/com/project/app/teachers/entity/TeacherSport.java
package com.project.app.teachers.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TEACHER_SPORT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@IdClass(TeacherSportId.class)
public class TeacherSport {

    @Id
    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Id
    @Column(name = "sport_id", nullable = false)
    private Long sportId;

    @Column(name = "main_yn", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean mainYn;

    @Column(name = "sort_no", nullable = false)
    private Integer sortNo;

    @Column(name = "reg_dt", nullable = false)
    private LocalDateTime regDt;

    @Column(name = "upd_dt", nullable = false)
    private LocalDateTime updDt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.regDt = (this.regDt == null) ? now : this.regDt;
        this.updDt = (this.updDt == null) ? now : this.updDt;
        if (this.mainYn == null) this.mainYn = false;
        if (this.sortNo == null) this.sortNo = 1;
    }

    @PreUpdate
    void onUpdate() {
        this.updDt = LocalDateTime.now();
    }
}
