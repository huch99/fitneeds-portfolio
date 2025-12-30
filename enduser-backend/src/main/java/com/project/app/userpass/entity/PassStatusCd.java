package com.project.app.userpass.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PassStatusCd {
	AVAILABLE("사용 가능"),
	UNAVAILABLE("사용 불가");		
	
	private final String description;
}
