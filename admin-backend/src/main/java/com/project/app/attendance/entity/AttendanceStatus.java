package com.project.app.attendance.entity;

public enum AttendanceStatus {
    ATTENDED,   // 출석
    ABSENT,     // 결석
    UNCHECKED   // 미체크 (CONFIRMED 상태)
}