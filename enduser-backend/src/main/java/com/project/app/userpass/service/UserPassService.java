package com.project.app.userpass.service;

import java.util.List;

import com.project.app.sporttype.entity.SportType;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;
import com.project.app.userpass.dto.UserPassResponseDto;
import com.project.app.userpass.entity.PassStatusCd;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.userpass.entity.PassLogChgTypeCd;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.repository.UserPassRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPassService {

    private final UserPassRepository userPassRepository;
    private final PassLogService passLogService;
    private final UserRepository userRepository;

    /**
     * 특정 사용자 ID에 해당하는 모든 이용권을 조회합니다. 이 메서드는 예약 관련 정보 조회를 위해 사용됩니다.
     *
     * @param userId 조회할 사용자의 ID
     * @return 해당 사용자의 UserPass 엔티티 목록
     */
    @Transactional(readOnly = true)
    public List<UserPass> getUserPassesByUserIdForR(String userId) {
        return userPassRepository.findByUser_UserId(userId);
    }

    /**
     * 특정 이용권의 잔여 횟수를 1 감소시키고 상태를 업데이트합니다. 이는 이용권 사용 시 호출되는 로직입니다.
     *
     * @param userPassId 사용할 이용권의 ID
     * @return 업데이트된 UserPass 엔티티
     * @throws IllegalArgumentException userPassId에 해당하는 이용권을 찾을 수 없거나, 이미 잔여 횟수가 0인
     *                                  경우
     */
    @Transactional
    public UserPass usePassForR(Long userPassId, String reason) {
        UserPass userPass = userPassRepository.findById(userPassId)
                .orElseThrow(() -> new IllegalArgumentException("이용권을 찾을 수 없습니다."));

        boolean succeess = userPass.decreaseRmnCnt(); // 잔여 횟수 감소 로직 실행

        if (!succeess) {
            throw new IllegalArgumentException("이용권 ID " + userPassId + "는 이미 잔여 횟수가 없어 사용할 수 없습니다.");
        }

        // 변경된 UserPass 상태를 DB에 저장
        UserPass updatedUserPass = userPassRepository.save(userPass);

        // PassLog 생성 (이용권이 성공적으로 사용된 후에 로그 기록)
        passLogService.createPassLog(updatedUserPass, PassLogChgTypeCd.USE, // 변경 타입: USE
                -1, // 변경 횟수: 1회 사용했으므로 -1
                reason != null ? reason : "스케줄 예약", // 사유: 전달된 사유 또는 기본값
                null // 누가 변경했는지(pocs_usr_id): 사용자 본인이므로 null
        );
        return updatedUserPass;
    }

    /**
     * 예약 취소 시 이용권의 잔여 횟수를 1 증가시키고 상태를 업데이트합니다.
     *
     * @param userPassId 복원할 이용권의 ID
     * @return 업데이트된 UserPass 엔티티
     * @throws IllegalArgumentException userPassId에 해당하는 이용권을 찾을 수 없는 경우 혹은 (선택사항)
     *                                  잔여 횟수가 초기 구매 수량을 초과하는 경우
     */
    @Transactional
    public UserPass cancelReservationAndUpdateUserPassForR(Long userPassId, String reason) {
        UserPass userPass = userPassRepository.findById(userPassId)
                .orElseThrow(() -> new IllegalArgumentException("이용권 ID " + userPassId + "에 해당하는 이용권을 찾을 수 없습니다."));

        boolean succeess = userPass.increaseRmnCnt();

        if (!succeess) {
            throw new IllegalArgumentException("이용권 ID " + userPassId + "의 잔여 횟수를 더 이상 증가시킬 수 없습니다.");
        }

        // 변경된 UserPass 상태를 DB에 저장
        UserPass updatedUserPass = userPassRepository.save(userPass);

        // PassLog 생성 (이용권이 성공적으로 복원된 후에 로그 기록)
        passLogService.createPassLog(
                updatedUserPass,
                PassLogChgTypeCd.CANCEL, // 변경 타입: CANCEL (취소로 인한 복원이므로)
                1, // 변경 횟수: 1회 증가했으므로 +1
                reason != null ? reason : "예약 취소로 이용권 복원", // 사유
                null // 누가 변경했는지(pocs_usr_id): 사용자 본인이므로 null
        );

        return updatedUserPass;
    }

    @Transactional(readOnly = true)
    public List<UserPassResponseDto> getUserPassResponses(String userId) {

        long count = userPassRepository.countUserPass();
        System.out.println("🔥 user_pass count = " + count);

        return userPassRepository.findUserPassesWithUserAndSport(userId)
                .stream()
                .map(UserPassResponseDto::from)
                .toList();
    }

    // ------------------------pass_trade

    @Transactional
    public UserPass usePassForTrade(Long userPassId, int buyCount, String reason) {
        UserPass userPass = userPassRepository.findById(userPassId)
                .orElseThrow(() -> new IllegalArgumentException("이용권을 찾을 수 없습니다."));

        if (buyCount <= 0) {
            throw new IllegalArgumentException("구매 수량은 1 이상이어야 합니다.");
        }

        if (userPass.getRmnCnt() < buyCount) {
            throw new IllegalArgumentException("잔여 횟수가 부족합니다.");
        }

        // ✅ 판매자 잔여 차감
        userPass.setRmnCnt(userPass.getRmnCnt() - buyCount);

        // ✅ 상태 자동 반영
        if (userPass.getRmnCnt() == 0) {
            userPass.setPassStatusCd(PassStatusCd.SUSPENDED);
        }

        UserPass updated = userPassRepository.save(userPass);

        // ✅ 로그 (enum은 프로젝트에 있는 값 사용)
        passLogService.createPassLog(
                updated,
                PassLogChgTypeCd.USE,
                -buyCount,
                reason,
                null
        );

        return updated;
    }


    @Transactional
    public UserPass addPassForTrade(
            String buyerId,
            SportType sportType,
            int buyCount,
            String reason
    ) {
        if (buyCount <= 0) {
            throw new IllegalArgumentException("구매 수량은 1 이상이어야 합니다.");
        }

        User buyer = userRepository.findByUserId(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("구매자 정보 없음"));

        UserPass userPass = userPassRepository
                .findByUser_UserIdAndSportType_SportId(buyerId, sportType.getSportId())
                .orElseGet(() -> UserPass.builder()
                        .user(buyer)
                        .sportType(sportType)
                        .passStatusCd(PassStatusCd.ACTIVE)
                        .rmnCnt(0)
                        .initCnt(0)
                        .build()
                );

        // ✅ 거래이므로 rmnCnt + initCnt 같이 증가
        userPass.setRmnCnt(userPass.getRmnCnt() + buyCount);
        userPass.setInitCnt(userPass.getInitCnt() + buyCount);
        userPass.setPassStatusCd(PassStatusCd.ACTIVE);

        UserPass saved = userPassRepository.save(userPass);

        passLogService.createPassLog(
                saved,
                PassLogChgTypeCd.USE,   // (있으면 TRADE_BUY로 교체 가능)
                buyCount,
                reason,
                null
        );

        return saved;
    }





}