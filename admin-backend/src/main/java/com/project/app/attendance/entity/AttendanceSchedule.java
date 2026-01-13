package com.project.app.attendance.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SCHEDULE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AttendanceSchedule {

    @Id
    @Column(name = "schd_id")
    private Long schdId;

    @Column(name = "prog_id")
    private Long progId;

    @Column(name = "user_id") // 강사ID
    private String userId;

    @Column(name = "brch_id")
    private Long brchId;

    @Column(name = "strt_dt")
    private LocalDate strtDt;

    @Column(name = "strt_tm")
    private LocalTime strtTm;

    @Column(name = "end_tm")
    private LocalTime endTm;

    @Column(name = "max_nop_cnt")
    private Integer maxNopCnt;

    @Column(name = "rsv_cnt")
    private Integer rsvCnt;

    @Column(name = "stts_cd")
    private String sttsCd;

    @Column(name = "description")
    private String description;
}

