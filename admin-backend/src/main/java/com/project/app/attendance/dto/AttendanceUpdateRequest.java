package com.project.app.attendance.dto;

import com.project.app.attendance.entity.AttendanceStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AttendanceUpdateRequest {

    private String status;

    public AttendanceStatus getStatus() {
        return AttendanceStatus.valueOf(status);
    }
}
