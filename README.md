# Fitneeds - 종합 운동 예약 프로그램 Fitneeds - 종합 운동 예약 프로그램

프로그램명 - Fitneeds (fitness + need)
Fitneeds는 **예약 관리** 에 중점을 둔 팀 프로젝트 입니다.
종목 -> 프로그램(수업) -> 스케줄 -> 결제 -> 예약까지의 도메인을 직접 모델링하고,
**상태 기반 설계와 트랜잭션 관리**에 중점을 두어 구현 했습니다.

단순 CRUD 구현이 아닌,
예약/결제 과정에서 발생할 수 있는 **데이터 정합성 문제와 예외 상황**을 고려하며
실제 서비스에 가까운 구조를 목표로 개발 했습니다.

---

## 프로젝트 구조

```text
fitneeds/
 ├ admin-backend/
 ├ admin-frontend/
 ├ enduser-backend/
 ├ enduser-frontend/
 └ docker-compose.yml
```

---

## 기술 스택

### Frontend
 - React
 - JavaScript
 - Figma

### Backend
 - Java (jdk 21)
 - Spring Boot 3
 - Gradle
 - MariaDB
 - JPA / Mybatis

---

## 아키텍처
![Architecture](docs/architecture_figma.png)
React 기반의 클라이언트는 REST API를 통해 Spring Boot 서버와 통신합니다.

## DB 설계 (ERD)
... 작성 중 입니다.
