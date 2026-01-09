package com.project.app.payment.enums;

/**
 * 결제 상태 Enum
 * 데이터베이스에는 VARCHAR로 저장되며, Java에서 Enum으로 관리
 */
public enum PaymentStatus {
    COMPLETED("COMPLETED", "완료"),
    PENDING("PENDING", "대기"),
    CANCELLED("CANCELLED", "취소");

    private final String code;
    private final String displayName;

    PaymentStatus(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static PaymentStatus fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (PaymentStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}


