package com.project.app.payment.enums;

/**
 * 결제 수단 Enum
 * 데이터베이스에는 VARCHAR로 저장되며, Java에서 Enum으로 관리
 */
public enum PaymentMethod {
    ACCOUNT_TRANSFER("ACCOUNT_TRANSFER", "계좌이체"),
    CARD("CARD", "카드결제"),
    COUNT_TICKET("COUNT_TICKET", "횟수권");

    private final String code;
    private final String displayName;

    PaymentMethod(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static PaymentMethod fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (PaymentMethod method : values()) {
            if (method.code.equals(code)) {
                return method;
            }
        }
        return null;
    }
}


