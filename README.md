# Unear - 위치 기반 멤버십 혜택 서비스

## 1. 프로젝트 개요

### 프로젝트 목적

본 프로젝트는 **LG U+ 연계 팝업 스토어 중심의 지역 기반 이벤트**에 사용자가 참여하며, 인근 제휴처(소상공인 포함)를 추천받고 **방문 인증을 통해 스탬프를 적립하는 참여형 혜택 플랫폼**입니다. 사용자는 지도 기반으로 주변 제휴처의 멤버십 혜택 및 할인 정보를 확인하며, **위치 진입 시 팝업 안내를 통해 이벤트 정보를 받고 멤버십 바코드 제출 및 결제 인증을 통해 참여하는 것을 목표**로 합니다.

### 핵심 가치

- **위치 기반 이벤트 참여**: LG U+ 팝업 스토어와 연계한 지역 맞춤형 이벤트 제공
- **스탬프 적립 시스템**: 방문 인증을 통한 스탬프 적립 및 보상 시스템
- **소상공인 상생**: 지역 소상공인 제휴처 추천을 통한 상생 생태계 구축
- **실시간 위치 알림**: 제휴처 진입 시 자동 팝업을 통한 이벤트 안내
- **통합 멤버십 관리**: 멤버십 바코드 제출 및 결제 인증을 통한 간편한 혜택 이용

## 2. 서비스 소개

**Unear**는 LG U+ 연계 팝업 스토어를 중심으로 한 지역 기반 참여형 혜택 플랫폼입니다. 사용자의 위치 정보를 활용하여 주변 제휴처의 이벤트 정보를 제공하고, 방문 인증을 통한 스탬프 적립 시스템으로 지역 상권 활성화를 도모합니다.

**🌟 주요 특징**
* **LG U+ 팝업 스토어 연계**: LG U+ 팝업 스토어 중심의 지역 이벤트 참여
* **위치 기반 알림**: 제휴처 진입 시 자동 팝업을 통한 실시간 이벤트 안내
* **스탬프 적립 시스템**: 방문 인증 및 결제 인증을 통한 스탬프 적립 및 보상
* **소상공인 제휴**: 지역 소상공인 매장 추천 및 상생 혜택 제공
* **멤버십 바코드 통합**: 간편한 바코드 제출을 통한 혜택 이용
* **소셜 로그인**: Google, Kakao, Naver 간편 로그인 지원

![메인 페이지 스크린샷](./docs/images/main-page.png)

## 3. Unear 관련 링크

- **Unear Frontend**: [프론트엔드 저장소](https://github.com/unear-project/unear-frontend)
- **Unear Backend**: [백엔드 저장소](https://github.com/unear-project/unear-backend)
- **Unear User Backend**: [사용자 백엔드 저장소](https://github.com/unear-project/unear-user-backend)
- **Notion**: [프로젝트 노션](https://notion.so/unear-project)
- **디자인 시안**: [Figma 디자인](https://figma.com/unear-design)

## 4. 디렉터리 구조

```
unear-frontend/
├── public/                          # 정적 파일
│   ├── images/                     # 이미지 파일
│   └── icons/                      # 아이콘 파일
├── src/
│   ├── apis/                       # API 호출 관련 파일
│   │   ├── axiosInstance.ts        # Axios 인스턴스 설정
│   │   ├── auth.ts                # 인증 관련 API
│   │   ├── getUserCoupons.ts      # 쿠폰 관련 API
│   │   ├── getPlaces.ts          # 장소 관련 API
│   │   └── ...                    # 기타 API 파일들
│   ├── assets/                     # 정적 자원
│   │   ├── common/                # 공통 아이콘/이미지
│   │   ├── main/                  # 메인 페이지 자원
│   │   ├── map/                   # 지도 관련 자원
│   │   ├── story/                 # 스토리 관련 자원
│   │   └── my/                    # 마이페이지 자원
│   ├── components/                 # 재사용 가능한 컴포넌트
│   │   ├── common/                # 공통 컴포넌트
│   │   │   ├── ActionButton.tsx   # 액션 버튼
│   │   │   ├── BottomNavigator.tsx # 하단 네비게이션
│   │   │   ├── CouponCard.tsx     # 쿠폰 카드
│   │   │   ├── Header.tsx         # 헤더
│   │   │   └── ...               # 기타 공통 컴포넌트들
│   │   ├── junior/               # 주니어 기능 컴포넌트
│   │   ├── map/                  # 지도 기능 컴포넌트
│   │   ├── my/                   # 마이페이지 컴포넌트
│   │   └── story/                # 스토리 컴포넌트
│   ├── hooks/                      # 커스텀 훅
│   │   ├── my/                    # 마이페이지 관련 훅
│   │   ├── useNotifications.ts    # 알림 관련 훅
│   │   └── useScrollToTop.ts      # 스크롤 제어 훅
│   ├── pages/                      # 페이지 컴포넌트
│   │   ├── auth/                  # 인증 관련 페이지
│   │   ├── MainPage.tsx           # 메인 페이지
│   │   ├── MapPage.tsx            # 지도 페이지
│   │   ├── StoryPage.tsx          # 스토리 페이지
│   │   ├── JuniorPage.tsx         # 주니어 페이지
│   │   └── MyPage.tsx             # 마이페이지
│   ├── providers/                  # Context Provider
│   │   └── AuthProvider.tsx       # 인증 Provider
│   ├── router/                     # 라우팅 설정
│   │   └── index.tsx              # 라우터 설정
│   ├── store/                      # 상태 관리 (Zustand)
│   │   └── auth.ts                # 인증 상태 관리
│   ├── types/                      # TypeScript 타입 정의
│   │   ├── coupon.ts              # 쿠폰 타입
│   │   ├── map.ts                 # 지도 타입
│   │   ├── store.ts               # 매장 타입
│   │   └── ...                    # 기타 타입들
│   ├── utils/                      # 유틸리티 함수
│   │   ├── formatDate.ts          # 날짜 포맷팅
│   │   ├── toast.ts               # 토스트 알림
│   │   └── tokenUtils.ts          # 토큰 관련 유틸
│   ├── index.css                   # 전역 스타일
│   ├── main.tsx                    # 애플리케이션 진입점
│   └── default.tsx                 # 기본 레이아웃
├── .env                            # 환경 변수
├── package.json                    # 의존성 관리
├── tailwind.config.js              # Tailwind CSS 설정
├── tsconfig.json                   # TypeScript 설정
├── vite.config.ts                  # Vite 빌드 도구 설정
└── README.md                       # 프로젝트 문서
```

## 5. 서버 실행 방법

### 개발 환경 설정

1. **Node.js 설치**
   - Node.js 18.0.0 이상 버전 필요

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   # .env 파일 생성
   VITE_API_BASE_URL=백엔드 서버 URL
   VITE_KAKAO_MAP_API_KEY=카카오 지도 API 키
   VITE_GOOGLE_CLIENT_ID=구글 클라이언트 ID
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 개발 서버가 http://localhost:4000에서 실행됩니다.

5. **빌드**
   ```bash
   npm run build
   ```

6. **프리뷰 (빌드된 결과물 미리보기)**
   ```bash
   npm run preview
   ```

7. **코드 포맷팅**
   ```bash
   npm run format
   ```

8. **린팅**
   ```bash
   npm run lint
   ```

## 6. 주요 기능 소개

### 6.1 메인 페이지 (MainPage)
![메인 페이지](./docs/images/main-page-detail.png)

- **주요 기능**: 개인화된 대시보드 및 추천 혜택 표시
- **핵심 컴포넌트**:
  - 멤버십 혜택 배너
  - 추천 매장 리스트
  - 개인 통계 요약
  - 스토리 추천 섹션
- **특징**: 개인화된 콘텐츠, 반응형 디자인, 실시간 데이터 업데이트

### 6.2 지도 기반 매장 검색 (MapPage)
![지도 페이지](./docs/images/map-page.png)

- **주요 기능**: 위치 기반 제휴처 검색 및 LG U+ 팝업 스토어 정보 표시
- **핵심 컴포넌트**:
  - `MapContainer.tsx`: 카카오맵 통합 컴포넌트
  - `BottomSheetLocationDetail.tsx`: 제휴처 상세 정보 바텀시트
  - `MapActionButtons.tsx`: 지도 액션 버튼들
  - `BottomSheetFilter.tsx`: 필터링 바텀시트
- **특징**: 실시간 위치 추적, 제휴처 진입 시 자동 팝업 알림, 카테고리별 필터링, 즐겨찾기 기능

### 6.3 개인화된 스토리 (StoryPage)
![스토리 페이지](./docs/images/story-page.png)

- **주요 기능**: 개인 맞춤형 할인 혜택 스토리 제공
- **핵심 컴포넌트**:
  - `StoryCard.tsx`: 스토리 카드 컴포넌트
  - `StoryLayout.tsx`: 스토리 레이아웃
  - `StoryDetailLayout.tsx`: 스토리 상세 레이아웃
- **특징**: 월별 개인화 스토리, AI 기반 추천, 인터랙티브 카드, 진단 시스템 연계

### 6.4 주니어 스탬프 이벤트 (JuniorPage)
![주니어 페이지](./docs/images/junior-page.png)

- **주요 기능**: 방문 인증을 통한 스탬프 적립 및 룰렛 이벤트 시스템
- **핵심 컴포넌트**:
  - `Roulette.tsx`: 룰렛 게임 컴포넌트
  - `ProbabilityRoulette.tsx`: 확률 기반 룰렛
  - `StampRouletteCard.tsx`: 스탬프 룰렛 카드
  - `TodayCouponSection.tsx`: 오늘의 쿠폰 섹션
- **특징**: 방문 인증 스탬프 시스템, 확률 기반 보상, 일일 한정 이벤트, 애니메이션 효과

### 6.5 마이페이지 (MyPage)
![마이페이지](./docs/images/my-page.png)

- **주요 기능**: 개인정보 관리, 쿠폰/북마크 관리, 통계 확인
- **핵심 컴포넌트**:
  - `UserProfileSection.tsx`: 사용자 프로필 섹션
  - `StatisticsSection.tsx`: 통계 요약 섹션
  - `MembershipBenefitSection.tsx`: 멤버십 혜택 섹션
  - `RecentUsageSection.tsx`: 최근 이용 내역 섹션
- **하위 페이지**:
  - 쿠폰 관리 (`/my/coupons`)
  - 북마크 관리 (`/my/bookmarks`)
  - 통계 상세 (`/my/statistics`)
  - 이용 내역 (`/my/usage-history`)
- **특징**: 실시간 통계 차트, 쿠폰 상태 관리, 즐겨찾기 매장 관리

### 6.6 멤버십 시스템 (MembershipPage)
![멤버십 페이지](./docs/images/membership-page.png)

- **주요 기능**: 브랜드별 멤버십 혜택 조회 및 관리
- **특징**: 브랜드별 할인율 정보, 카테고리 필터링, 혜택 상세 정보

### 6.7 인증 시스템 (Auth)
![로그인 페이지](./docs/images/auth-page.png)

- **주요 기능**: 소셜 로그인 및 회원 관리, 방문/결제 인증 시스템
- **지원 플랫폼**: 카카오, 구글, 네이버
- **특징**: JWT 기반 인증, 보호된 라우트 관리, 멤버십 바코드 통합 관리

### 6.8 공통 컴포넌트 (components/common)

- **BottomNavigator.tsx**: 하단 탭 네비게이션
- **Header.tsx**: 페이지별 헤더
- **CouponCard.tsx**: 쿠폰 카드 컴포넌트
- **LoadingSpinner.tsx**: 로딩 표시
- **특징**: 일관된 디자인 시스템, 접근성 및 반응형 지원

## 7. 기술 스택

### Frontend Framework & Language
- **React 19.1.0**: 사용자 인터페이스 구축 메인 프레임워크
- **TypeScript**: 정적 타입 언어로 코드 안정성 향상
- **TSX**: React 컴포넌트 타입 안전 마크업

### 빌드 도구 & 개발 환경
- **Vite 7.0.0**: 빠른 빌드 도구 및 개발 서버
- **ESLint**: 코드 품질 및 스타일 검사
- **Prettier**: 코드 포맷팅
- **PostCSS**: CSS 후처리

### UI & 스타일링
- **Tailwind CSS 3.4.17**: 유틸리티 퍼스트 CSS 프레임워크
- **Framer Motion 12.23.6**: 고급 애니메이션 라이브러리
- **Lucide React**: 아이콘 라이브러리
- **Swiper 11.2.10**: 터치 슬라이더 컴포넌트

### 상태 관리 & 라우팅
- **React Router DOM 7.6.3**: 클라이언트 사이드 라우팅
- **Zustand 5.0.6**: 경량 상태 관리 라이브러리
- **TanStack Query 5.83.0**: 서버 상태 관리

### 통신 & API
- **Axios 1.10.0**: HTTP 클라이언트
- **REST API**: 백엔드 서버와의 데이터 통신

### UI 컴포넌트 & 라이브러리
- **MUI Material 7.2.0**: Material Design 컴포넌트 라이브러리
- **React Icons 5.5.0**: 다양한 아이콘 세트
- **React Barcode 1.6.1**: 바코드 생성 컴포넌트
- **DayJS 1.11.13**: 날짜 처리 라이브러리

### 지도 & 위치 서비스
- **Kakao Map API**: 지도 서비스 및 위치 기반 기능

### 개발 도구
- **npm**: 패키지 관리
- **Git**: 버전 관리
- **Storybook 9.0.17**: 컴포넌트 개발 환경
- **Vitest**: 테스팅 프레임워크

### 배포
- **Vercel**: 프론트엔드 배포 및 호스팅
- **Docker**: 컨테이너화 배포 지원

## 8. 팀원 소개

| ![@1seyoung](https://github.com/1seyoung.png) | ![@lbk00](https://github.com/lbk00.png) | ![@tjdqls3607](https://github.com/tjdqls3607.png) | ![@khwww](https://github.com/khwww.png) | ![@KimJunSeo289](https://github.com/KimJunSeo289.png) | ![@alex8396](https://github.com/alex8396.png) | ![@Hongjunior](https://github.com/Hongjunior.png) |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 한세영 | 이본규 | 정성빈 | 김현우 | 김준서 | 임재찬 | 홍석준 |
| [@1seyoung](https://github.com/1seyoung) | [@lbk00](https://github.com/lbk00) | [@tjdqls3607](https://github.com/tjdqls3607) | [@khwww](https://github.com/khwww) | [@KimJunSeo289](https://github.com/KimJunSeo289) | [@alex8396](https://github.com/alex8396) | [@Hongjunior](https://github.com/Hongjunior) |
| **BE 팀장** | BE | BE | **FE 팀장** | FE | FE | FE |

### 역할 분담

#### Backend Team
- **한세영 (BE 팀장)**: 시스템 아키텍처 설계, 인증/권한 관리, API 설계
- **이본규**: 사용자 관리 시스템, 쿠폰/혜택 관리 API 개발
- **정성빈**: 지도/위치 서비스, 데이터베이스 설계 및 최적화

#### Frontend Team  
- **김현우 (FE 팀장)**: 프론트엔드 아키텍처 설계, 공통 컴포넌트 개발, 성능 최적화
- **김준서**: 지도 페이지, 주니어 페이지, 상태 관리 시스템 구축
- **임재찬**: 메인 페이지, 스토리 페이지, UI/UX 구현
- **홍석준**: 마이페이지, 인증 시스템, 모바일 반응형 구현

---

## 9. 프로젝트 특징

### 반응형 디자인
- 모바일 퍼스트 접근 방식 (최대 너비 600px)
- 사용자 친화적 UI/UX 설계
- Tailwind CSS를 활용한 일관된 디자인 시스템

### 사용자 경험 (UX)
- 직관적인 인터페이스와 명확한 네비게이션
- 큰 버튼과 명확한 텍스트로 접근성 향상
- 부드러운 애니메이션과 피드백으로 사용성 개선

### 성능 최적화
- Vite 기반 빠른 개발 및 빌드 환경
- TanStack Query를 통한 효율적인 데이터 캐싱
- 이미지 최적화 및 지연 로딩

### 개발 환경
- TypeScript로 타입 안전성 확보
- ESLint + Prettier 코드 품질 관리
- Storybook을 통한 컴포넌트 단위 개발
- Git 기반 협업 워크플로우

### 보안 & 인증
- JWT 기반 토큰 인증
- 소셜 로그인 (카카오, 구글, 네이버) 지원
- 보호된 라우트를 통한 인가 관리

---

_이 README는 Unear 프론트엔드 프로젝트의 개요와 사용법을 안내합니다. 추가 질문이나 기술 지원이 필요한 경우 팀원에게 문의해주세요._