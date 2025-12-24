package com.project.app.branch.dto;

import java.time.LocalDateTime;

import com.project.app.branch.entity.Branch;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BranchResponseDto {

	private Long brchId;
	private String brchNm;
	private String addr;
	private boolean operYn;
	private LocalDateTime regDt;
	private LocalDateTime updDt;
	
	public static BranchResponseDto from (Branch branch) {
		return BranchResponseDto.builder()
				.brchId(branch.getBrchId())
				.brchNm(branch.getBrchNm())
				.addr(branch.getAddr())
				.operYn(branch.isOperYn())
				.regDt(branch.getRegDt())
				.updDt(branch.getUpdDt())
				.build();
	}
}
