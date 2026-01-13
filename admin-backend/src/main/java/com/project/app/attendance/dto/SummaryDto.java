package com.project.app.attendance.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SummaryDto {

    private final int reserved;
    private final int canceled;
    private final int attended;

    public static SummaryDto of(
            int reserved,
            int canceled,
            int attended
    ) {
        return new SummaryDto(reserved, canceled, attended);
    }
}


