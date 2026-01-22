package com.project.app.passfaq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "FAQ")
@Getter
@Setter
public class PassFaq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id")
    private Long faqId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String category;

    @Column(name = "view_cnt", nullable = false)
    private Integer viewCnt = 0;

    @Column(name = "reg_dt", updatable = false)
    private LocalDateTime regDt;

    @Column(name = "upd_dt")
    private LocalDateTime updDt;

    @Column(name = "ans_stat", nullable = false)
    private String ansStat; // WAIT / DONE

    @Column(name = "ans_by")
    private String ansBy;

    @Column(name = "ans_at")
    private LocalDateTime ansAt;
}
