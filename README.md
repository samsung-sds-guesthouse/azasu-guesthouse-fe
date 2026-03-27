# Azasu Guesthouse - 프론트엔드

아자스 게스트하우스 예약 시스템 프론트엔드입니다.

---

## 팀원

| 역할 | 이름 |
|------|------|
| 사용자 파트 | 이종욱 프로, 조성제 프로 |
| 관리자 파트 | 박한빛 프로 |

---

## 기술 스택

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Flatpickr](https://img.shields.io/badge/Flatpickr-F77F00?style=for-the-badge&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white)

| 기술 | 설명 |
|------|------|
| HTML5 | 시맨틱 마크업, ARIA 접근성 속성 |
| CSS3 | CSS 변수, Flexbox, Grid 기반 모듈형 구조 |
| JavaScript ES6+ | 프레임워크 없이 Fetch API, async/await 활용 |
| Flatpickr | 날짜 범위 선택 라이브러리 (CDN) |
| Google Fonts | Noto Serif KR / Noto Sans KR |

---

## 프로젝트 구조

```
azasu-guesthouse-fe/
├── css/
│   ├── base/           # CSS 변수, 리셋
│   ├── layout/         # 헤더, 푸터
│   ├── components/     # 버튼, 폼, 카드
│   ├── pages/          # 페이지별 스타일
│   └── style.css       # 엔트리포인트 (@import)
│
├── js/
│   ├── api/            # API 호출 모듈
│   │   ├── config.js   # Base URL, fetchApi() 래퍼
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── reservations.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── components/
│   │   └── header.js   # 인증 상태 기반 동적 헤더
│   ├── pages/          # 페이지별 JS 로직
│   ├── auth.js         # 라우트 가드 (checkAdmin, checkUser)
│   └── utils.js        # 유틸 함수 (escapeHTML, formatDate 등)
│
├── index.html              # 메인 (객실 목록, 검색)
├── login.html
├── signup.html
├── find-id.html
├── find-pw.html
├── room-detail.html        # 객실 상세 및 예약
├── reservation.html        # 예약 내역 조회/취소
├── mypage.html             # 회원 정보 관리
├── admin-dashboard.html    # 관리자 대시보드
├── admin-room-add.html
├── admin-room-edit.html
└── admin-reservation.html
```

---

## 주요 기능

### 사용자

| 기능 | 설명 |
|------|------|
| 회원가입 | ID 중복 확인, SMS 인증, 실시간 유효성 검사 |
| 로그인 / 로그아웃 | 세션 기반 인증 (sessionStorage) |
| 아이디 찾기 / 비밀번호 재설정 | SMS 인증으로 본인 확인 |
| 객실 검색 | 체크인·체크아웃 날짜, 인원수 필터 |
| 객실 예약 | 가용 여부 확인 후 예약 생성 |
| 예약 내역 | 페이지네이션, 예약 취소 |
| 마이페이지 | 프로필 조회, 비밀번호 변경, 회원 탈퇴 |

### 관리자

| 기능 | 설명 |
|------|------|
| 객실 관리 | 객실 추가·수정, 이미지 업로드 (최대 15MB), 활성화/비활성화 |
| 예약 관리 | 전체 예약 조회, 상태 변경 (PENDING → CONFIRMED / CANCELLED) |

---

## API 연동

기본 URL: `http://localhost:8080/api/v1`

모든 인증 요청은 쿠키 기반 세션(JSESSIONID)으로 처리됩니다.

### 인증

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/login` | 로그인 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/signup` | 회원가입 |
| GET | `/auth/duplicate-id` | ID 중복 확인 |
| POST | `/auth/sms` | SMS 인증 발송 |
| GET | `/auth/find-id` | 아이디 찾기 |
| POST | `/auth/find-pw` | 비밀번호 재설정 |
| GET | `/auth/my-info` | 내 정보 조회 |
| POST | `/auth/change-pw` | 비밀번호 변경 |
| POST | `/auth/withdraw` | 회원 탈퇴 |

### 객실

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/rooms` | 객실 목록 (검색 파라미터 지원) |
| GET | `/rooms/:roomId` | 객실 상세 |

### 예약

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/reservations` | 예약 생성 |
| GET | `/reservations/me` | 내 예약 목록 |
| POST | `/reservations/:id/delete` | 예약 취소 |

### 관리자

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/admin/rooms` | 전체 객실 목록 |
| POST | `/admin/rooms` | 객실 추가 |
| POST | `/admin/rooms/:id/modify` | 객실 수정 |
| POST | `/admin/rooms/:id/activation` | 객실 활성화 토글 |
| GET | `/admin/reservations` | 전체 예약 목록 |
| POST | `/admin/reservations/:id/modify` | 예약 상태 변경 |

---

## 실행 방법

이 프로젝트는 빌드 도구 없이 정적 파일로 동작합니다.

1. **백엔드 서버 실행** — `http://localhost:8080` 에서 API 서버가 실행 중이어야 합니다.

2. **프론트엔드 실행** — 로컬 HTTP 서버로 파일을 제공합니다.

   ```bash
   # VS Code Live Server (권장)
   # index.html에서 우클릭 → Open with Live Server
   ```

3. 브라우저에서 `http://localhost:5500` 접속

> `index.html`을 브라우저에서 직접 열면 CORS 문제가 발생할 수 있으므로 로컬 서버를 통해 실행하는 것을 권장합니다.

---

## 세션 스토리지 구조

| Key | 설명 |
|-----|------|
| `user` | 사용자 정보 `{ login_id, name, role }` |
| `searchParams` | 객실 검색 필터 캐시 |

인증은 서버 세션(JSESSIONID 쿠키)으로 유지되며, `role`이 `ADMIN`인 경우 관리자 페이지에 접근할 수 있습니다.

---

## 보안

- XSS 방지: 모든 사용자 입력 데이터는 `escapeHTML()` 처리 후 DOM에 삽입
- 라우트 가드: 인증되지 않은 사용자 또는 권한 없는 사용자는 자동으로 로그인 페이지로 리다이렉트
- 이미지 업로드 유효성 검사: 파일 형식(jpg/jpeg/webp/png) 및 크기(15MB) 서버·클라이언트 이중 검증