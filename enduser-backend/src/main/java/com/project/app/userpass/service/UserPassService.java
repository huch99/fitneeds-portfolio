package com.project.app.userpass.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.repository.UserPassRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPassService {

	private final UserPassRepository userPassRepository;
	
	/**
     * 특정 사용자 ID에 해당하는 모든 이용권을 조회합니다.
     * 이 메서드는 예약 관련 정보 조회를 위해 사용됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 UserPass 엔티티 목록
     */
	@Transactional
	public List<UserPass> getUserPassesByUserIdForR(String userId) {
		return userPassRepository.findByUser_UserId(userId);
	}
	
	/**
     * 특정 이용권의 잔여 횟수를 1 감소시키고 상태를 업데이트합니다.
     * 이는 이용권 사용 시 호출되는 로직입니다.
     *
     * @param userPassId 사용할 이용권의 ID
     * @return 업데이트된 UserPass 엔티티
     * @throws IllegalArgumentException userPassId에 해당하는 이용권을 찾을 수 없거나, 이미 잔여 횟수가 0인 경우
     */
	@Transactional
	public UserPass usePassForR(Long userPassId) {
		UserPass userPass = userPassRepository.findById(userPassId)
				.orElseThrow(() -> new IllegalArgumentException("이용권을 찾을 수 없습니다."));
		
		boolean succeess = userPass.decreaseRmnCnt();
		
		if (!succeess) {
			throw new IllegalArgumentException("이용권 ID " + userPassId + "는 이미 잔여 횟수가 없어 사용할 수 없습니다.");
		}
		
		return userPass;
	}
	
	/**
     * 예약 취소 시 이용권의 잔여 횟수를 1 증가시키고 상태를 업데이트합니다.
     * @param userPassId 복원할 이용권의 ID
     * @return 업데이트된 UserPass 엔티티
     * @throws IllegalArgumentException userPassId에 해당하는 이용권을 찾을 수 없는 경우
     *                                  혹은 (선택사항) 잔여 횟수가 초기 구매 수량을 초과하는 경우
     */
    @Transactional
    public UserPass cancelReservationAndUpdateUserPassForR(Long userPassId) {
    	UserPass userPass = userPassRepository.findById(userPassId)
    			.orElseThrow(() -> new IllegalArgumentException("이용권 ID " + userPassId + "에 해당하는 이용권을 찾을 수 없습니다."));
    	
    	boolean succeess = userPass.increaseRmnCnt();
    	
    	if (!succeess) {
            throw new IllegalArgumentException("이용권 ID " + userPassId + "의 잔여 횟수를 더 이상 증가시킬 수 없습니다.");
    	}
    	
    	return userPass;
    }
}
