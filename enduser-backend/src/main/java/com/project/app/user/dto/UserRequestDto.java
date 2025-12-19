package com.project.app.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // getter, setter, equals, hashCode, toString 자동 생성
@NoArgsConstructor      // 파라미터 없는 기본 생성자
@AllArgsConstructor     // 모든 필드를 파라미터로 받는 생성자
@Builder                // 빌더 패턴 구현
public class UserRequestDto {
	private String userId;
	private String email;
	private String userName;
	private String password;
	private String role;
	private String cash_point;
	private String grade_point;
	private String is_active;
	private String agree_at;
	private String phone_number;
	private String user_id;
	private String user_nam;
	private boolean success;
	private String message;
}