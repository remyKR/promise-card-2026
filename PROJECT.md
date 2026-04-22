# Promise Card — 프로젝트 정의서

## 프로젝트 목표
**업로드된 Figma 파일(Untitled.fig)을 디자인 시스템으로 변환.**
청첩장 에디터 서비스 "Promise Card"의 Figma 디자인을 토큰화·문서화하여, 이후 모든 화면과 컴포넌트 제작의 기반이 되는 디자인 시스템을 구축한다.

## 맥락
- 서비스명: **Promise Card** (베트남 시장 대상 청첩장 에디터, 한국어/베트남어 혼용 UI)
- 디자인 원본: Figma 파일 1개 (1 page, 1 top-level frame "B" — 1920×1372px 에디터 화면)
- 핵심 가치: **심플 + 세련됨 + 하이퀄리티** (사용자 강조)
- 참조: https://theirmood.com/card/create (방향성 레퍼런스, 복제 대상 아님)

## 작업 순서
1. **[현재 단계] 디자인 시스템 구축** — Figma 원본 기반 토큰·컴포넌트 문서
2. 디자인 시스템 기반으로 청첩장 에디터 전체 플로우 재구성
3. 최종 청첩장 열람 화면 및 추가 플로우 확장

## Figma 원본 분석 결과 (요약)

### 레이아웃
- 전체: 1920×1372px
- 좌측 에디터(프리뷰 영역): 1440px 폭, 배경 `#FBF5F0`
- 우측 사이드패널(폼 영역): 480px 폭, 배경 `#FFFFFF`
- 상단 헤더: 72px, 로고 좌측

### 컬러 (실제 추출값)
| 용도 | HEX |
|---|---|
| 배경 (외곽) | `#F4EAE4` |
| 배경 (메인) | `#FBF5F0` |
| 패널 배경 | `#FFFFFF` |
| 텍스트 Primary | `#000000` |
| 텍스트 Secondary | `#4F4F4F` |
| 텍스트 Label | `#6B7280` |
| 텍스트 Placeholder | `#AFB7C5` / `#9CA3AF` |
| 포인트 Brown | `#7B4401` (네비게이션) |
| 포인트 Brown (30%) | 라인 구분선 |
| Active Bar | `#333333` |
| Inactive Bar | `#E5E7EB` |
| CTA Black | `#000000` |
| CTA Muted | `#999999` |
| Progress Fill | `#111827` |
| 스와치 Peach | `#F6DACE` |

### 타이포그래피
| 폰트 | Weight | 주요 사이즈 | 용도 |
|---|---|---|---|
| SUIT | Bold | 18 / 16 | UI 라벨, 로고 |
| SUIT | Regular | 13 | 보조 텍스트 |
| SVN-Poppins | SemiBold (Bold) | 26 / 16 / 14 | 헤더, 폼 라벨, 값 |
| Pretendard | Bold | 15 | 버튼 텍스트 |
| Poppins | Bold | 14 | 네비게이션 |

### 컴포넌트
- **Logo**: 다이아몬드 SVG (38×29, #000) + "promise\ncard" (SUIT Bold 16px, line-height 0.89)
- **Button**: 120×48, radius 8, black(`#000`) / muted(`#999`) / 텍스트 Pretendard Bold 15
- **Form Input (phone_bar01)**: 언더라인 스타일. Active 바 2px `#333`, Inactive 2px `#E5E7EB`. Label SVN-Poppins Bold 16
- **Dropdown**: 인풋 + arrowOpen 8×8 아이콘 (우측)
- **Theme Thumbnail**: 130×200, radius 10, 실사 커플 이미지 / 선택 시 우상단 24×24 검정 원 + 흰 체크
- **Color Swatch**: 52×52, radius 32 (원형)
- **Pagination**: "1/4" 라벨 + 2px 트랙(`#E5E7EB`) + 2px 프로그레스(`#111827`, 약 30% 길이) + 좌우 화살표 버튼
- **Theme Navigation**: 상하 border 1px `#7B4401` 30%, 중앙 "1/8", 좌우 "이전테마"/"다음테마" (Poppins Bold 14, `#7B4401`)
- **Section Header**: 2줄 구조 ("테마를\n선택해주세요." SVN-Poppins Bold 26px, line-height 1.3)
- **Error Message**: 3×3 dot(`#CCC`) + SVN-Poppins 13 `#6B7280`

### 이미지 에셋
- 커플 사진 실사 PNG (SINERVA 테마 메인)
- "SINERVA" 로고타이포 이미지 (266×83 PNG)

## 남은 결정 사항
- 디자인 시스템 출력 형태 (단일 페이지 vs 분할 페이지 vs Storybook 스타일)
- 토큰 이름 규칙 (시맨틱 vs 스케일 vs 둘 다)
- 폰트 처리 (원본 유지 vs 대체 vs web-safe)
- 인터랙티브 수준 (정적 vs hover/focus vs 완전 인터랙티브)
- 포함할 컴포넌트 범위

## 다음 단계
위 질문들에 대한 답변 수신 후 → 디자인 시스템 문서 구축 시작
