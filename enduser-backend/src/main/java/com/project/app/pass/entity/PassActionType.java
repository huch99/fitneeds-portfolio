package com.project.app.pass.entity;

/**
 * 이용권 로그 액션 타입
 * userpass / pass 공통 개념
 * "로그 의미"만 정의하고, 상태 변경 책임은 없음
 */
public enum PassActionType {

    CREATE,
    USE,
    REFUND,
    EXPIRE,
    SUSPEND,
    ACTIVATE,
    BUY,
    SELL;

}
