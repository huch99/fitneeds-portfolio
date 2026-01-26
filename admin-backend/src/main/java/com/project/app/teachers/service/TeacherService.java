// file: src/main/java/com/project/app/teachers/service/TeacherService.java
package com.project.app.teachers.service;

import com.project.app.branch.entity.Branch;
import com.project.app.branch.repository.BranchRepository;
import com.project.app.config.util.UserIdGenerator;
import com.project.app.myclass.dto.MyClassDto;
import com.project.app.myclass.dto.ScheduleListQuery;
import com.project.app.myclass.dto.row.MyClassScheduleRow;
import com.project.app.myclass.mapper.MyClassMapper;
import com.project.app.sportTypes.entity.SportType;
import com.project.app.sportTypes.repository.SportTypeRepository;
import com.project.app.teachers.dto.TeacherDto;
import com.project.app.teachers.dto.TeacherStatusUpdateReq;
import com.project.app.teachers.entity.*;
import com.project.app.teachers.mapper.TeacherMapper;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.repository.UserAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherMapper teacherMapper;
    private final UserAdminRepository userAdminRepo;
    private final BranchRepository branchRepo;
    private final SportTypeRepository sportTypeRepo;
    private final PasswordEncoder passwordEncoder;

    // ✅ 강사 배정 수업 목록 조회용
    private final MyClassMapper myClassMapper;

    private static final Set<String> ALLOWED_ROLES = Set.of("ADMIN", "MANAGER", "TEACHER");

    // ------------------------
    // Public APIs (권한 포함)
    // ------------------------

    @Transactional(readOnly = true)
    public List<TeacherDto.Resp> list(String requesterId, Long requestedBranchId, Long sportId, String status) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        // status 정규화 + 허용값 검증 (RETIRED 호환: RESIGNED로 치환)
        String resolvedStatus = normalizeStatus(status);

        // 권한에 따라 branch/user scope 강제
        if ("TEACHER".equals(role)) {
            // 본인만
            return listAsTeacher(requesterId, sportId, resolvedStatus);
        }

        Long effectiveBranchId = requestedBranchId;
        if ("MANAGER".equals(role)) {
            if (requester.getBrchId() == null) {
                throw new IllegalStateException("MANAGER has no brchId");
            }
            effectiveBranchId = requester.getBrchId();
        }
        // ADMIN: requestedBranchId 그대로 사용

        List<TeacherProfile> profiles;
        if (sportId != null) {
            List<String> userIds = teacherMapper.findUserIdsBySportId(sportId);
            if (userIds == null || userIds.isEmpty()) return List.of();
            profiles = teacherMapper.findByUserIdInAndFilters(userIds, effectiveBranchId, resolvedStatus);
        } else {
            profiles = (effectiveBranchId == null)
                    ? teacherMapper.findBySttsCd(resolvedStatus)
                    : teacherMapper.findByBrchIdAndSttsCd(effectiveBranchId, resolvedStatus);
        }

        if (profiles == null || profiles.isEmpty()) return List.of();
        return profiles.stream().filter(Objects::nonNull).map(this::toSummaryResp).toList();
    }

    @Transactional(readOnly = true)
    public TeacherDto.Resp detail(String requesterId, String targetUserId) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        TeacherProfile target = teacherMapper.findById(targetUserId);
        if (target == null) {
            throw new IllegalArgumentException("TeacherProfile not found: " + targetUserId);
        }

        enforceAccessToTarget(role, requester, target);
        return toFullResp(target);
    }

    /**
     * ✅ 신규: "강사 배정된 수업(스케줄) 목록"
     * - ADMIN: 모든 강사 조회 가능
     * - MANAGER: 본인 지점 강사만 조회 가능(teacher 접근도 지점으로 제한)
     * - TEACHER: 본인 것만 조회 가능
     */
    @Transactional(readOnly = true)
    public List<MyClassDto.ScheduleResp> listAssignedSchedules(String requesterId, String targetTeacherId, ScheduleListQuery q) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        TeacherProfile target = teacherMapper.findById(targetTeacherId);
        if (target == null) {
            throw new IllegalArgumentException("TeacherProfile not found: " + targetTeacherId);
        }

        // ✅ 여기서 “대상 강사 접근 권한”을 먼저 확정 (MANAGER는 지점 동일해야 함 / TEACHER는 본인만)
        enforceAccessToTarget(role, requester, target);

        ScheduleListQuery query = (q == null) ? new ScheduleListQuery() : q;

        // ✅ teacherId는 무조건 path 변수 우선 (프론트에서 teacherId param으로 장난 못 치게)
        query.setTeacherId(targetTeacherId);

        // ✅ MANAGER는 지점 범위를 강제로 본인 지점으로
        if ("MANAGER".equals(role)) {
            if (requester.getBrchId() == null) throw new IllegalStateException("MANAGER has no brchId");
            query.setBrchId(requester.getBrchId());
        }

        // ADMIN은 query의 brchId 필터가 들어오면 그대로 적용(선택)
        return myClassMapper.selectScheduleList(query).stream()
                .filter(Objects::nonNull)
                .map(this::toMyClassScheduleResp)
                .toList();
    }

    @Transactional
    public TeacherDto.Resp create(String requesterId, TeacherDto.CreateReq req) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        // TEACHER 생성 금지
        if ("TEACHER".equals(role)) throw new AccessDeniedException("TEACHER cannot create teachers");

        // MANAGER은 본인 지점으로만 생성
        if ("MANAGER".equals(role)) {
            if (requester.getBrchId() == null) throw new IllegalStateException("MANAGER has no brchId");
            if (req.brchId() == null) {
                req = new TeacherDto.CreateReq(
                        req.userId(),
                        req.userName(),
                        req.email(),
                        req.password(),
                        req.phoneNumber(),
                        requester.getBrchId(),
                        req.hireDt(),
                        req.intro(),
                        req.profileImgUrl(),
                        req.updUserId(),
                        req.sports(),
                        req.certificates(),
                        req.careers()
                );
            } else if (!Objects.equals(req.brchId(), requester.getBrchId())) {
                throw new AccessDeniedException("MANAGER can only create teachers in own branch");
            }
        }

        // FK 확인 (branch 존재)
        requireBranch(req.brchId());

        String userId = (req.userId() == null || req.userId().isBlank())
                ? new UserIdGenerator().generateUniqueUserId()
                : req.userId();

        if (userAdminRepo.existsByUserId(userId)) throw new IllegalArgumentException("UserAdmin already exists: " + userId);
        if (userAdminRepo.existsByEmail(req.email())) throw new IllegalArgumentException("Email already exists: " + req.email());

        // USERS_ADMIN 생성 (role='TEACHER')
        UserAdmin userAdmin = UserAdmin.builder()
                .userId(userId)
                .userName(req.userName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .phoneNumber(req.phoneNumber())
                .role("TEACHER")
                .agreeAt(LocalDateTime.now())
                .isActive(true)
                .brchId(req.brchId())
                .build();
        userAdminRepo.save(userAdmin);
        userAdminRepo.flush();

        // TEACHER_PROFILE 생성 (✅ profileImgUrl 포함)
        TeacherProfile profile = TeacherProfile.builder()
                .userId(userId)
                .brchId(req.brchId())
                .sttsCd("ACTIVE")
                .hireDt(req.hireDt())
                .leaveRsn("")
                .intro(req.intro())
                .profileImgUrl(req.profileImgUrl())
                .regDt(LocalDateTime.now())
                .updDt(LocalDateTime.now())
                .updUserId(req.updUserId())
                .build();
        teacherMapper.insert(profile);

        // TEACHER_SPORT / CERT / CAREER
        upsertChildren(userId, req.updUserId(), req.sports(), req.certificates(), req.careers());

        return detail(requesterId, userId);
    }

    @Transactional
    public TeacherDto.Resp update(String requesterId, String targetUserId, TeacherDto.UpdateReq req) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        TeacherProfile targetProfile = teacherMapper.findById(targetUserId);
        if (targetProfile == null) {
            throw new IllegalArgumentException("TeacherProfile not found: " + targetUserId);
        }

        enforceAccessToTarget(role, requester, targetProfile);

        // TEACHER는 지점 변경 금지
        if ("TEACHER".equals(role) && req.brchId() != null && !Objects.equals(req.brchId(), targetProfile.getBrchId())) {
            throw new AccessDeniedException("TEACHER cannot change branch");
        }

        UserAdmin targetUser = userAdminRepo.findByUserId(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("UserAdmin not found: " + targetUserId));

        // BRCH 변경 시 존재 확인
        if (req.brchId() != null) requireBranch(req.brchId());

        // USERS_ADMIN 수정
        if (req.userName() != null) targetUser.setUserName(req.userName());
        if (req.phoneNumber() != null) targetUser.setPhoneNumber(req.phoneNumber());
        if (req.email() != null && !req.email().equals(targetUser.getEmail())) {
            if (userAdminRepo.existsByEmail(req.email())) throw new IllegalArgumentException("Email already exists: " + req.email());
            targetUser.setEmail(req.email());
        }
        if (req.brchId() != null) targetUser.setBrchId(req.brchId());
        userAdminRepo.save(targetUser);

        // TEACHER_PROFILE 수정 (✅ profileImgUrl 반영)
        targetProfile.update(req.brchId(), req.intro(), req.profileImgUrl(), req.updUserId());
        teacherMapper.update(targetProfile);

        // 하위 테이블 교체
        if (req.sports() != null) {
            teacherMapper.deleteSportsByUserId(targetUserId);
            req.sports().stream().filter(Objects::nonNull).forEach(s -> {
                TeacherSport sport = TeacherSport.builder()
                        .userId(targetUserId)
                        .sportId(s.sportId())
                        .mainYn(Boolean.TRUE.equals(s.mainYn()))
                        .sortNo(s.sortNo() == null ? 1 : s.sortNo())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .build();
                teacherMapper.insertSport(sport);
            });
        }
        if (req.certificates() != null) {
            teacherMapper.deleteCertsByUserId(targetUserId);
            req.certificates().stream().filter(Objects::nonNull).forEach(c -> {
                TeacherCertificate cert = TeacherCertificate.builder()
                        .userId(targetUserId)
                        .certNm(c.certNm())
                        .issuer(c.issuer())
                        .acqDt(c.acqDt())
                        .certNo(c.certNo())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .updUserId(req.updUserId())
                        .build();
                teacherMapper.insertCert(cert);
            });
        }
        if (req.careers() != null) {
            teacherMapper.deleteCareersByUserId(targetUserId);
            req.careers().stream().filter(Objects::nonNull).forEach(c -> {
                TeacherCareer career = TeacherCareer.builder()
                        .userId(targetUserId)
                        .orgNm(c.orgNm())
                        .roleNm(c.roleNm())
                        .strtDt(c.strtDt())
                        .endDt(c.endDt())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .updUserId(req.updUserId())
                        .build();
                teacherMapper.insertCareer(career);
            });
        }

        return detail(requesterId, targetUserId);
    }

    @Transactional
    public void retire(String requesterId, String targetUserId, TeacherDto.RetireReq req) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        if ("TEACHER".equals(role)) throw new AccessDeniedException("TEACHER cannot retire teachers");

        TeacherProfile targetProfile = teacherMapper.findById(targetUserId);
        if (targetProfile == null) {
            throw new IllegalArgumentException("TeacherProfile not found: " + targetUserId);
        }
        enforceAccessToTarget(role, requester, targetProfile);

        UserAdmin targetUser = userAdminRepo.findByUserId(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("UserAdmin not found: " + targetUserId));

        String updaterId = req.updaterId();
        String leaveRsn = (req.leaveRsn() == null) ? "" : req.leaveRsn();

        targetProfile.retire(req.leaveDt(), leaveRsn, updaterId);
        teacherMapper.update(targetProfile);

        targetUser.setIsActive(false);
        userAdminRepo.save(targetUser);
    }

    @Transactional
    public void updateStatus(String requesterId, String targetUserId, TeacherStatusUpdateReq req) {
        UserAdmin requester = requireRequester(requesterId);
        String role = safe(requester.getRole());
        requireKnownRole(role);

        if ("TEACHER".equals(role)) throw new AccessDeniedException("TEACHER cannot change status");

        TeacherProfile targetProfile = teacherMapper.findById(targetUserId);
        if (targetProfile == null) {
            throw new IllegalArgumentException("TeacherProfile not found: " + targetUserId);
        }
        enforceAccessToTarget(role, requester, targetProfile);

        String newStatus = normalizeStatus(req.getSttsCd());

        // RESIGNED는 retire API로만 가능
        if ("RESIGNED".equals(newStatus)) {
            throw new IllegalArgumentException("퇴직 상태는 /retire API로만 변경 가능합니다.");
        }

        targetProfile.setSttsCd(newStatus);
        targetProfile.setUpdDt(LocalDateTime.now());
        teacherMapper.update(targetProfile);
    }

    // ------------------------
    // 권한/유틸
    // ------------------------

    private void requireKnownRole(String role) {
        if (!ALLOWED_ROLES.contains(role)) {
            throw new AccessDeniedException("Unknown role: " + role);
        }
    }

    private UserAdmin requireRequester(String requesterId) {
        return userAdminRepo.findByUserId(requesterId)
                .orElseThrow(() -> new AccessDeniedException("Requester not found"));
    }

    private void enforceAccessToTarget(String role, UserAdmin requester, TeacherProfile targetProfile) {
        // ADMIN: 전체 접근
        if ("ADMIN".equals(role)) return;

        // MANAGER: 본인 지점만
        if ("MANAGER".equals(role)) {
            if (requester.getBrchId() == null) throw new IllegalStateException("MANAGER has no brchId");
            if (!Objects.equals(requester.getBrchId(), targetProfile.getBrchId())) {
                throw new AccessDeniedException("MANAGER can only manage own branch teachers");
            }
            return;
        }

        // TEACHER: 본인만
        if ("TEACHER".equals(role)) {
            if (!Objects.equals(requester.getUserId(), targetProfile.getUserId())) {
                throw new AccessDeniedException("TEACHER can only access own profile");
            }
            return;
        }

        throw new AccessDeniedException("Unknown role: " + role);
    }

    private List<TeacherDto.Resp> listAsTeacher(String requesterId, Long sportId, String status) {
        TeacherProfile p = teacherMapper.findById(requesterId);
        if (p == null) return List.of();

        if (status != null && !status.isBlank() && !status.equals(p.getSttsCd())) return List.of();

        if (sportId != null) {
            boolean hasSport = teacherMapper.findSportsByUserId(requesterId).stream()
                    .anyMatch(s -> s != null && Objects.equals(s.getSportId(), sportId));
            if (!hasSport) return List.of();
        }
        return List.of(toSummaryResp(p));
    }

    private void requireBranch(Long brchId) {
        if (brchId == null) throw new IllegalArgumentException("brchId is null");
        if (!branchRepo.existsById(brchId)) throw new IllegalArgumentException("Branch not found: " + brchId);
    }

    private String safe(String s) { return (s == null) ? "" : s; }

    /**
     * status 정규화:
     * - null/blank => ACTIVE
     * - 대문자 변환
     * - RETIRED(과거값) => RESIGNED
     * - 허용값: ACTIVE / LEAVE / RESIGNED
     */
    private String normalizeStatus(String status) {
        String s = (status == null || status.isBlank()) ? "ACTIVE" : status.trim().toUpperCase();
        if ("RETIRED".equals(s)) s = "RESIGNED";
        if (!Set.of("ACTIVE", "LEAVE", "RESIGNED").contains(s)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        return s;
    }

    private void upsertChildren(
            String userId,
            String updUserId,
            List<TeacherDto.SportReq> sports,
            List<TeacherDto.CertificateReq> certs,
            List<TeacherDto.CareerReq> careers
    ) {
        if (sports != null) {
            sports.stream().filter(Objects::nonNull).forEach(s -> {
                TeacherSport sport = TeacherSport.builder()
                        .userId(userId)
                        .sportId(s.sportId())
                        .mainYn(Boolean.TRUE.equals(s.mainYn()))
                        .sortNo(s.sortNo() == null ? 1 : s.sortNo())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .build();
                teacherMapper.insertSport(sport);
            });
        }

        if (certs != null) {
            certs.stream().filter(Objects::nonNull).forEach(c -> {
                TeacherCertificate cert = TeacherCertificate.builder()
                        .userId(userId)
                        .certNm(c.certNm())
                        .issuer(c.issuer())
                        .acqDt(c.acqDt())
                        .certNo(c.certNo())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .updUserId(updUserId)
                        .build();
                teacherMapper.insertCert(cert);
            });
        }

        if (careers != null) {
            careers.stream().filter(Objects::nonNull).forEach(c -> {
                TeacherCareer career = TeacherCareer.builder()
                        .userId(userId)
                        .orgNm(c.orgNm())
                        .roleNm(c.roleNm())
                        .strtDt(c.strtDt())
                        .endDt(c.endDt())
                        .regDt(LocalDateTime.now())
                        .updDt(LocalDateTime.now())
                        .updUserId(updUserId)
                        .build();
                teacherMapper.insertCareer(career);
            });
        }
    }

    // ✅ MyClassScheduleRow -> MyClassDto.ScheduleResp (Teacher에서 재사용)
    private MyClassDto.ScheduleResp toMyClassScheduleResp(MyClassScheduleRow r) {
        return new MyClassDto.ScheduleResp(
                r.getSchdId(),
                r.getProgId(),
                r.getProgNm(),
                r.getTeacherId(),
                r.getTeacherName(),
                r.getBrchId(),
                r.getBrchNm(),
                r.getStrtDt(),
                r.getStrtTm(),
                r.getEndTm(),
                r.getMaxNopCnt(),
                r.getRsvCnt(),
                r.getSttsCd(),
                r.getDescription()
        );
    }

    // ------------------------
    // Mapping helpers (기존 그대로)
    // ------------------------

    private TeacherDto.Resp toSummaryResp(TeacherProfile profile) {
        UserAdmin ua = userAdminRepo.findByUserId(profile.getUserId()).orElse(null);
        Branch br = branchRepo.findById(profile.getBrchId()).orElse(null);

        List<TeacherSport> sports = teacherMapper.findSportsByUserId(profile.getUserId());
        List<TeacherDto.SportResp> sportResps = toSportResps(sports);

        return new TeacherDto.Resp(
                profile.getUserId(),
                ua != null ? safe(ua.getUserName()) : "",
                ua != null ? safe(ua.getEmail()) : "",
                ua != null ? safe(ua.getPhoneNumber()) : "",
                profile.getBrchId(),
                br != null ? safe(br.getBrchNm()) : "",
                ua != null ? safe(ua.getRole()) : "",
                ua != null && Boolean.TRUE.equals(ua.getIsActive()) ? 1 : 0,
                safe(profile.getSttsCd()),
                profile.getHireDt(),
                profile.getLeaveDt(),
                safe(profile.getLeaveRsn()),
                safe(profile.getIntro()),
                safe(profile.getProfileImgUrl()),
                sportResps,
                List.of(),
                List.of(),
                profile.getRegDt(),
                profile.getUpdDt(),
                safe(profile.getUpdUserId())
        );
    }

    private TeacherDto.Resp toFullResp(TeacherProfile profile) {
        UserAdmin ua = userAdminRepo.findByUserId(profile.getUserId()).orElse(null);
        Branch br = branchRepo.findById(profile.getBrchId()).orElse(null);

        List<TeacherSport> sports = teacherMapper.findSportsByUserId(profile.getUserId());
        List<TeacherCertificate> certs = teacherMapper.findCertsByUserId(profile.getUserId());
        List<TeacherCareer> careers = teacherMapper.findCareersByUserId(profile.getUserId());

        List<TeacherDto.SportResp> sportResps = toSportResps(sports);

        List<TeacherDto.CertificateResp> certResps = (certs == null ? List.<TeacherCertificate>of() : certs).stream()
                .filter(Objects::nonNull)
                .map(c -> new TeacherDto.CertificateResp(
                        c.getCertId(), safe(c.getCertNm()), safe(c.getIssuer()), c.getAcqDt(), safe(c.getCertNo())))
                .toList();

        List<TeacherDto.CareerResp> careerResps = (careers == null ? List.<TeacherCareer>of() : careers).stream()
                .filter(Objects::nonNull)
                .map(c -> new TeacherDto.CareerResp(
                        c.getCareerId(), safe(c.getOrgNm()), safe(c.getRoleNm()), c.getStrtDt(), c.getEndDt()))
                .toList();

        return new TeacherDto.Resp(
                profile.getUserId(),
                ua != null ? safe(ua.getUserName()) : "",
                ua != null ? safe(ua.getEmail()) : "",
                ua != null ? safe(ua.getPhoneNumber()) : "",
                profile.getBrchId(),
                br != null ? safe(br.getBrchNm()) : "",
                ua != null ? safe(ua.getRole()) : "",
                ua != null && Boolean.TRUE.equals(ua.getIsActive()) ? 1 : 0,
                safe(profile.getSttsCd()),
                profile.getHireDt(),
                profile.getLeaveDt(),
                safe(profile.getLeaveRsn()),
                safe(profile.getIntro()),
                safe(profile.getProfileImgUrl()),
                sportResps,
                certResps,
                careerResps,
                profile.getRegDt(),
                profile.getUpdDt(),
                safe(profile.getUpdUserId())
        );
    }

    private List<TeacherDto.SportResp> toSportResps(List<TeacherSport> sports) {
        if (sports == null || sports.isEmpty()) return List.of();

        List<Long> sportIds = sports.stream()
                .filter(Objects::nonNull)
                .map(TeacherSport::getSportId)
                .distinct()
                .toList();

        Map<Long, String> sportNameMap = sportTypeRepo.findAllById(sportIds).stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(SportType::getSportId, s -> safe(s.getSportNm()), (a, b) -> a));

        return sports.stream()
                .filter(Objects::nonNull)
                .map(s -> new TeacherDto.SportResp(
                        s.getSportId(),
                        sportNameMap.getOrDefault(s.getSportId(), ""),
                        Boolean.TRUE.equals(s.getMainYn()) ? 1 : 0,
                        s.getSortNo() == null ? 1 : s.getSortNo()
                ))
                .toList();
    }
}
