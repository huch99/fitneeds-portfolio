package com.project.app;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.project.app.config.util.UserIdGenerator;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;
import com.project.app.userAdmin.entity.UserAdmin;
import com.project.app.userAdmin.repository.BranchRepository;
import com.project.app.userAdmin.repository.UserAdminRepository;
import com.project.app.branch.service.BranchService;
import com.project.app.sportTypes.service.SportTypeService;
import com.project.app.sportTypes.entity.SportType;
import com.project.app.payment.service.PaymentService;
import com.project.app.payment.service.PassProductService;
import com.project.app.payment.service.PassLogService;
import com.project.app.payment.domain.Payment;
import com.project.app.payment.domain.PassProduct;
import com.project.app.payment.domain.PassLog;
import com.project.app.program.service.ProgramService;
import com.project.app.program.domain.Program;

/**
 * Spring Boot 애플리케이션의 시작점 (메인 클래스)
 */
@SpringBootApplication
public class AppApplication {

	// 애플리케이션 실행 메소드
	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	/**
	 * RestTemplate Bean 등록 외부 API를 호출할 때 사용하는 HTTP 클라이언트 도구
	 */
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	/**
	 * 애플리케이션 시작 시 테스트용 사용자 계정 자동 생성
	 */
	@Bean
	public CommandLineRunner createTestUser(UserAdminRepository userAdminRepository, UserRepository userRepository,
			BranchRepository branchRepository, BranchService branchService, SportTypeService sportTypeService,
			PaymentService paymentService, PassProductService passProductService, PassLogService passLogService,
			ProgramService programService, PasswordEncoder passwordEncoder) {
		return args -> {

			if (!userAdminRepository.existsByUserId("5eb5bc176d7f4394be3b9f1381f1e398") && !userAdminRepository.existsByEmail("admin@naver.com")) {
				UserAdmin adminUser = new UserAdmin();
				adminUser.setUserId("5eb5bc176d7f4394be3b9f1381f1e398");
				adminUser.setEmail("admin@naver.com");
				adminUser.setUserName("Admin");
				adminUser.setPassword(passwordEncoder.encode("admin"));
				adminUser.setRole("ADMIN"); // 관리자 권한
				adminUser.setPhoneNumber("01011111234");
				adminUser.setAgreeAt(LocalDateTime.now());
				adminUser.setIsActive(true);
				adminUser.setBrchId(1L);
				userAdminRepository.save(adminUser);
				System.out.println("[테스트 계정 생성] 이메일: admin@naver.com, 비밀번호: admin");
			}

			if (!userAdminRepository.existsByUserId("fcdd1ac36f064893b5b2e090df931c6d") && !userAdminRepository.existsByEmail("fitneeds@fitneeds.com")) {
				UserAdmin adminUser = new UserAdmin();
				adminUser.setUserId("fcdd1ac36f064893b5b2e090df931c6d");
				adminUser.setEmail("fitneeds@fitneeds.com");
				adminUser.setUserName("fitneeds");
				adminUser.setPassword(passwordEncoder.encode("fullstack2025"));
				adminUser.setRole("ADMIN"); // 관리자 권한
				adminUser.setPhoneNumber("01099991234");
				adminUser.setAgreeAt(LocalDateTime.now());
				adminUser.setIsActive(true);
				adminUser.setBrchId(2L);
				userAdminRepository.save(adminUser);
				System.out.println("[테스트 계정 생성] 이메일: fitneeds@fitneeds.com, 비밀번호: fullstack2025");
			}

			// 일반 사용자 계정 생성 (아이디: user, 비밀번호: user)
			if (!userRepository.existsByUserId("adeaa7d5174c4be78756651b4dd8c361") && !userRepository.existsByEmail("user1@naver.com")) {
				User testUser = new User();
				testUser.setUserId("adeaa7d5174c4be78756651b4dd8c361");
				testUser.setEmail("user1@naver.com");
				testUser.setUserName("User1");
				testUser.setPassword(passwordEncoder.encode("user1"));
				testUser.setRole("USER"); // 일반 사용자 권한
				testUser.setCashPoint(0);
				testUser.setGradePoint(0);
				testUser.setPhoneNumber("01099111234");
				testUser.setAgreeAt(LocalDateTime.now());
				testUser.setIsActive(true);
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 이메일: user1@naver.com, 비밀번호: user1");
			}

			if (!userRepository.existsByUserId("0ef59f5e0bc54abc891236e3a15e3bda") && !userRepository.existsByEmail("user2@naver.com")) {
				User testUser = new User();
				testUser.setUserId("0ef59f5e0bc54abc891236e3a15e3bda");
				testUser.setEmail("user2@naver.com");
				testUser.setUserName("User2");
				testUser.setPassword(passwordEncoder.encode("user2"));
				testUser.setRole("USER"); // 일반 사용자 권한
				testUser.setCashPoint(0);
				testUser.setGradePoint(0);
				testUser.setPhoneNumber("01022221234");
				testUser.setAgreeAt(LocalDateTime.now());
				testUser.setIsActive(true);
				userRepository.save(testUser);
				System.out.println("[테스트 계정 생성] 이메일: user2@naver.com, 비밀번호: user2");
			}

			// 기본 지점 데이터 생성
			createDefaultBranches(branchService);

			// 각 지점별로 프로그램 2개씩 생성
			createProgramsForAllBranches(branchService, programService, sportTypeService);

		};
	}
	
	/**
	 * 기본 지점 데이터 생성
	 * @param branchService 지점 서비스
	 */
	private void createDefaultBranches(BranchService branchService) {
		try {
			// 기존 지점 확인
			java.util.List<com.project.app.branch.domain.Branch> existingBranches = branchService.findAll();
			if (existingBranches != null && !existingBranches.isEmpty()) {
				System.out.println("[지점 생성] 기존 지점이 " + existingBranches.size() + "개 존재합니다. 스킵합니다.");
				return;
			}
			
			// 기본 지점 데이터
			java.util.List<com.project.app.branch.domain.Branch> defaultBranches = new java.util.ArrayList<>();
			
			// 1L: 수원본점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(1L)
				.brchNm("수원본점")
				.addr("경기도 수원시 영통구 월드컵로 123")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 2L: 강남점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(2L)
				.brchNm("강남점")
				.addr("서울특별시 강남구 테헤란로 456")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 3L: 잠실점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(3L)
				.brchNm("잠실점")
				.addr("서울특별시 송파구 올림픽로 300")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 4L: 홍대점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(4L)
				.brchNm("홍대점")
				.addr("서울특별시 마포구 홍익로 123")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 5L: 강서점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(5L)
				.brchNm("강서점")
				.addr("서울특별시 강서구 화곡로 456")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 6L: 영통점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(6L)
				.brchNm("영통점")
				.addr("경기도 수원시 영통구 원천동")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 7L: 기흥점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(7L)
				.brchNm("기흥점")
				.addr("경기도 용인시 기흥구 기흥로 789")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 8L: 기흥11
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(8L)
				.brchNm("기흥11")
				.addr("경기도 용인시 기흥구 기흥로11번길 12")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 9L: 인계점
			defaultBranches.add(com.project.app.branch.domain.Branch.builder()
				.brchId(9L)
				.brchNm("인계점")
				.addr("경기도 수원시 팔달구 인계동")
				.operYn(1)
				.regDt(LocalDateTime.now().toString())
				.updDt(LocalDateTime.now().toString())
				.build());
			
			// 지점 생성
			int createdCount = 0;
			for (com.project.app.branch.domain.Branch branch : defaultBranches) {
				try {
					branchService.create(branch);
					createdCount++;
					System.out.println("[지점 생성] " + branch.getBrchNm() + " (ID: " + branch.getBrchId() + ") 생성 완료");
				} catch (Exception e) {
					System.out.println("[지점 생성] " + branch.getBrchNm() + " 생성 실패: " + e.getMessage());
				}
			}
			
			System.out.println("[지점 생성] 총 " + createdCount + "개의 지점이 생성되었습니다.");
		} catch (Exception e) {
			System.out.println("[지점 생성] 오류: " + e.getMessage());
			e.printStackTrace();
		}
	}
	
	/**
	 * 모든 지점별로 프로그램 2개씩 생성
	 */
	private void createProgramsForAllBranches(BranchService branchService, ProgramService programService, 
			SportTypeService sportTypeService) {
		try {
			// 모든 지점 가져오기
			java.util.List<com.project.app.branch.domain.Branch> allBranches = branchService.findAll();
			if (allBranches == null || allBranches.isEmpty()) {
				System.out.println("[프로그램 생성] 생성할 지점이 없습니다.");
				return;
			}
			
			// 모든 스포츠 종목 가져오기
			java.util.List<SportType> allSports = sportTypeService.findAll();
			if (allSports == null || allSports.isEmpty()) {
				System.out.println("[프로그램 생성] 스포츠 종목이 없습니다.");
				return;
			}
			
			// 모든 기존 프로그램 가져오기
			java.util.List<Program> existingPrograms = programService.findAll();
			
			// 프로그램명 템플릿
			String[] programTemplates = {
				"%s 기초 클래스", "%s 중급 클래스", "%s 개인 레슨", "%s 그룹 레슨"
			};
			
			// 타입 코드 배열 (개인/그룹)
			String[] typeCds = {"PERSONAL", "GROUP"};
			
			// 상세 타입 코드 배열
			String[] detailTypeCds = {
				"BEGINNER", "INTERMEDIATE", "ADVANCED"
			};
			
			// 1회 금액 배열 (원)
			Integer[] oneTimeAmts = {20000, 25000, 30000, 35000};
			
			// 보상 포인트 배열
			Integer[] rwdGamePoints = {100, 150, 200, 250};
			
			Random random = new Random();
			int totalCreated = 0;
			
			// 각 지점별로 처리
			for (com.project.app.branch.domain.Branch branch : allBranches) {
				String branchName = branch.getBrchNm();
				if (branchName == null || branchName.trim().isEmpty()) {
					continue;
				}
				
				// 해당 지점의 기존 프로그램 개수 확인
				long existingCount = existingPrograms.stream()
					.filter(p -> p.getProgNm() != null && p.getProgNm().startsWith(branchName))
					.count();
				
				// 이미 2개 이상 있으면 스킵
				if (existingCount >= 2) {
					System.out.println("[프로그램 생성] " + branchName + " 지점의 프로그램이 이미 " + existingCount + "개 존재합니다. 스킵합니다.");
					continue;
				}
				
				// 2개 생성 (기존 개수만큼 빼서 생성)
				int needToCreate = 2 - (int)existingCount;
				
				for (int i = 0; i < needToCreate; i++) {
					// 스포츠 종목 랜덤 선택
					SportType selectedSport = allSports.get(random.nextInt(allSports.size()));
					Long sportId = selectedSport.getSportId();
					
					// 프로그램명 생성
					String progNm = String.format(programTemplates[i % programTemplates.length], branchName);
					
					// 타입 코드 선택
					String typeCd = typeCds[i % typeCds.length];
					
					// 상세 타입 코드 선택
					String detailTypeCd = detailTypeCds[i % detailTypeCds.length];
					
					// 1회 금액 선택
					Integer oneTimeAmt = oneTimeAmts[i % oneTimeAmts.length];
					
					// 보상 포인트 선택
					Integer rwdGamePoint = rwdGamePoints[i % rwdGamePoints.length];
					
					Program program = Program.builder()
							.progNm(progNm)
							.sportId(String.valueOf(sportId))
							.typeCd(typeCd)
							.useYn(1)
							.oneTimeAmt(oneTimeAmt)
							.rwdGamePoint(rwdGamePoint)
							.regDt(LocalDateTime.now())
							.updDt(LocalDateTime.now())
							.detailTypeCd(detailTypeCd)
							.build();
					
					programService.create(program);
					totalCreated++;
					System.out.println("[프로그램 생성] " + progNm + " (종목: " + selectedSport.getSportNm() + 
							", 타입: " + typeCd + ") 생성 완료");
				}
				
				System.out.println("[프로그램 생성] " + branchName + " 지점 프로그램 " + needToCreate + "개 생성 완료");
			}
			
			System.out.println("[프로그램 생성] 총 " + totalCreated + "개의 프로그램이 생성되었습니다.");
		} catch (Exception e) {
			System.out.println("[프로그램 생성] 오류: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
