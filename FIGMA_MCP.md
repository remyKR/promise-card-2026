# FIGMA_MCP.md

> **대상:** Claude Code with **TalkToFigma MCP** plugin
> **목표:** 빈 Figma 파일에 Promise Card 디자인 시스템 + 스크린을 1:1로 구축
> **소스:** `design-tokens.json`, `components.spec.json`, `tokens.css`, `Design System.html`, `Promise Card Editor.html`

---

## 0. 사전 준비

### 0.1 필수 파일 확인
Claude Code는 작업 시작 전 아래 파일을 모두 읽을 것:
- `design-tokens.json` — 모든 컬러/타이포/스페이싱 값 (W3C DTCG 포맷)
- `components.spec.json` — 컴포넌트 레이어 트리 + 토큰 바인딩
- `tokens.css` — CSS 변수 원본 (참조용)
- `Design System.html` — 렌더링된 디자인 시스템 (시각 참조)
- `Promise Card Editor.html` — 에디터 화면 (시각 참조)
- `assets/logo/diamond.svg`, `assets/logo/promise-card-wordmark.png` — 로고 에셋
- `assets/fonts/SVN-Poppins.ttf` — 본문 폰트

### 0.2 폰트
- **SVN-Poppins** (display + body) — Figma에 로컬 폰트로 설치 필요
- **SUIT** (로고 워드마크) — Google Fonts / 시스템 설치
- **Times New Roman italic** (프리뷰 내 숫자 장식용)

### 0.3 TalkToFigma 연결
1. Figma 데스크탑에서 새 빈 파일 생성 (이름: `Promise Card — Design System`)
2. TalkToFigma 플러그인 실행, 채널 ID 복사
3. Claude Code에서 `join_channel` 호출 → 연결 확인

### 0.4 전역 규칙
- **네이밍**: 모든 레이어/컴포넌트는 **kebab-case** (`button-primary-lg`, `theme-card`)
- **Auto Layout**: 모든 프레임에 강제 적용
- **Grid**: Desktop 1920 프레임은 12-column grid (margin 80, gutter 24) overlay
- **언어**: 목업 내 모든 텍스트는 **베트남어** (카피 예시는 아래 §9 참고)
- **단위**: 모든 dimension은 px
- **라운딩**: `design-tokens.json`의 값을 그대로 사용 (반올림 금지)

---

## 1. 페이지 구조

Figma 파일에 아래 순서대로 페이지 생성:

1. `📐 00 · Cover` — 파일 커버
2. `🎨 01 · Foundations` — 토큰 시각화 (컬러/타이포/스페이싱/라디우스/섀도우)
3. `🧩 02 · Components` — 모든 Figma Components + variants
4. `🖥️ 03 · Editor (Desktop 1920)` — 에디터 화면 단계별 프레임
5. `📱 04 · Preview (Mobile 375)` — 청첩장 프리뷰 화면
6. `📱 05 · Final View (Mobile 375)` — 최종 열람 모드 8개 섹션
7. `📎 99 · Assets` — 로고, 아이콘, 이미지 원본

---

## 2. Phase 1 — Variables (디자인 토큰)

`design-tokens.json`의 `_meta.figma.collections` 기준으로 **6개 Variable Collection** 생성.

### 2.1 컬렉션 & 모드
```
Primitives   — mode: Default
Semantic     — mode: Light
Typography   — mode: Default
Spacing      — mode: Default
Radius       — mode: Default
Shadow       — mode: Default
```

### 2.2 Primitives/color (kebab-case 변환)
`Primitives.color.gray.0` → **Figma variable name**: `primitives/color/gray-0`

예시 매핑:
| JSON path | Figma variable | Value |
|---|---|---|
| `Primitives.color.gray.0` | `primitives/color/gray-0` | `#FFFFFF` |
| `Primitives.color.gray.900` | `primitives/color/gray-900` | `#111723` |
| `Primitives.color.gold.500` | `primitives/color/gold-500` | `#CDA66E` |
| `Primitives.color.gold.700` | `primitives/color/gold-700` | `#7B4401` |
| `Primitives.color.cream.100` | `primitives/color/cream-100` | `#FBF5F0` |
| `Primitives.color.swatch.peach` | `primitives/color/swatch-peach` | `#FFF2EC` |
| *(…전체 `design-tokens.json.Primitives.color.*` 참고)* | | |

### 2.3 Semantic/color (aliased — Primitives 참조)
JSON의 `{Primitives.color.gray.900}` 형태의 ref는 Figma Variable alias로 연결.

예시:
| Figma variable | Alias → |
|---|---|
| `semantic/color/text-primary` | `primitives/color/gray-900` |
| `semantic/color/text-accent` | `primitives/color/gold-700` |
| `semantic/color/surface-canvas` | `primitives/color/cream-100` |
| `semantic/color/action-primary` | `primitives/color/gray-950` |
| `semantic/color/border-accent` | raw `#7B44014D` (30% opacity gold-700) |

### 2.4 Typography
Figma Variables는 숫자/문자열/불리언만 지원 → **typography composites는 Text Styles로 등록** (§3).
아래만 variable로:
- `typography/family/display` = `"SVN-Poppins"` (string)
- `typography/family/body` = `"SVN-Poppins"`
- `typography/family/brand` = `"SUIT"`
- `typography/weight/regular` = `400` … `bold` = `700`
- `typography/size/xs` … `display` = 숫자

### 2.5 Spacing / Radius / Shadow
- `spacing/1` = 4, `spacing/2` = 8 … `spacing/20` = 80
- `radius/none` = 0, `xs` = 4, `sm` = 6, `md` = 8, `lg` = 10, `xl` = 20, `full` = 999
- **Shadow는 variable 미지원** → Effect Styles로 등록 (§3.2)

### 2.6 검증
생성 후 Claude Code는:
1. `get_local_variables` 호출
2. 총 variable 개수가 `design-tokens.json`에서 집계한 개수와 일치하는지 확인
3. 누락된 항목 리포트

---

## 3. Phase 1.5 — Styles

### 3.1 Paint Styles (Color Styles)
Semantic 컬러는 **동일 네이밍으로 Paint Style도 함께 생성** (plugin/타 도구 호환성 위해).
- `semantic/text/primary` → fill = variable alias `semantic/color/text-primary`
- `semantic/text/accent`, `semantic/surface/canvas`, `semantic/surface/panel`, `semantic/border/subtle`, `semantic/border/accent`, `semantic/action/primary` 등

### 3.2 Effect Styles
`design-tokens.json.Shadow` 전체:
- `shadow/sm` → Drop Shadow (0, 1, 2, 0, `#00000014`)
- `shadow/md` → (0, 4, 12, 0, `#0000000F`)
- `shadow/card` → (0, 4, 4, 0, `#0000000F`)
- `shadow/lg` → (0, 12, 32, 0, `#00000014`)

### 3.3 Text Styles
`design-tokens.json.Typography.style.*` 전체를 Text Style로:
| Style name | Family | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `display` | SVN-Poppins | 700 | 64 | 1.1 | -0.01em |
| `section-title` | SVN-Poppins | 700 | 34 | 1.2 | -0.01em |
| `card-heading` | SVN-Poppins | 700 | 26 | 1.3 | — |
| `lede` | SVN-Poppins | 400 | 18 | 1.5 | — |
| `input-value` | SVN-Poppins | 700 | 16 | 1.2 | — |
| `label` | SVN-Poppins | 700 | 14 | 1.2 | — |
| `caption` | SVN-Poppins | 400 | 13 | 1.5 | — |
| `eyebrow` | SVN-Poppins | 700 | 11 | 1.0 | 0.12em |
| `button-label` | SVN-Poppins | 700 | 14 | 1.0 | — |

---

## 4. Phase 2 — Foundations 페이지

`🎨 01 · Foundations` 페이지. 1920 폭 프레임, 12-col grid.

### 4.1 섹션 순서 (세로 스택, gap 120)
1. **Cover card** — 제목 "Promise Card · Design System" + 버전 + 날짜
2. **Color / Primitives** — 각 램프(gray/gold/cream/swatch)를 가로 스와치 행으로
3. **Color / Semantic** — `text/*`, `surface/*`, `border/*`, `action/*`, `accent/*` 별 카드
4. **Typography** — 위 9개 스타일을 "The quick brown fox…" + 베트남어 샘플로 각각 렌더
5. **Spacing** — `0~20` 까지 막대 시각화 (숫자 라벨 + px 값)
6. **Radius** — 7개 라운딩 값을 160×100 박스로 시각화
7. **Shadow** — 4개 섀도우를 흰 카드에 적용해 비교

### 4.2 렌더 규칙
- 각 스와치는 변수 참조(variable binding)로 채워야 함 — 하드코딩 금지
- 각 값 옆에 `primitives/color/gray-900` 같은 **토큰 이름 라벨** 병기

---

## 5. Phase 3 — Components 페이지

`🧩 02 · Components` 페이지. 각 컴포넌트를 **Figma Component + Variants**로 생성.

`components.spec.json.components` 배열의 각 항목이 1개 컴포넌트 세트.

### 5.1 생성 순서 & 네이밍
| spec name | Figma component name | Variant property |
|---|---|---|
| `Button/Primary` | `button-primary` | `state` = default / hover |
| `Button/Secondary` | `button-secondary` | `state` = default / hover |
| `Button/Ghost` | `button-ghost` | — |
| `Input/Underline` | `input-underline` | `state` = empty / filled |
| `Select/Underline` | `select-underline` | `state` = empty / filled |
| `Swatch/Circle` | `swatch-circle` | `state` = default / selected, `color` = peach/blush/blue/cream/mint/lavender/violet |
| `ThemeCard` | `theme-card` | `state` = default / selected |
| `Stepper` | `stepper` | — |
| `ThemePagination` | `theme-pagination` | — |
| `PreviewFrame` | `preview-frame` | — (instance swap image로 처리) |
| `Logo` | `logo` | — |
| `SectionHeader` | `section-header` | — |

### 5.2 레이어 트리 준수
`components.spec.json`의 `children`/`layout`/`variants` 필드를 **있는 그대로** 옮길 것.
- `layout.type: "autolayout"` → Auto Layout 활성
- `layout.direction` → Vertical / Horizontal
- `paddingX`/`paddingY`/`gap` → Auto Layout padding/gap
- `primaryAlign: "space-between"` → Auto Layout 정렬 양 끝
- `fill: "var:Semantic.color.action.primary"` → Figma variable binding `semantic/color/action-primary`
- `typography: "var:Typography.style.buttonLabel"` → Text Style 적용

### 5.3 Variant 만들기
예: `Button/Primary`
1. default 상태 프레임 생성 → Create Component
2. 해당 컴포넌트 복제 → fill을 `action-primaryHover`로 변경
3. 둘을 묶어 Combine as Variants → property name `state`

### 5.4 검증
각 컴포넌트 생성 후:
- `get_node` 로 레이어 트리 확인
- variable binding이 정상 연결됐는지 체크 (fill 색상이 하드코딩이 아닌 variable ref인지)

---

## 6. Phase 4 — Editor 화면 (Desktop 1920)

`🖥️ 03 · Editor (Desktop 1920)` 페이지.

### 6.1 프레임
- Name: `editor-desktop--step-1` … `editor-desktop--step-5`
- Size: 1920 × 1372 (spec의 1440 기준에서 1920으로 확장 시, 좌측 Preview Area를 센터링)
- Fill: `semantic/color/surface-canvas`
- Grid: 12-col / margin 80 / gutter 24

### 6.2 단계별 내용
`src/steps.jsx` 참고 (5단계: Giao diện → Cô dâu chú rể → Lễ cưới → Câu chuyện → Hoàn thành).
`components.spec.json.screens[0]` (B — Editor Screen)의 regions 구조를 따름:

- **Header** (상단 72px, Logo 좌측)
- **Preview Area** (좌측 ~1440px, 중앙 정렬)
  - WordmarkImage (266×83, PNG)
  - `theme-pagination` 인스턴스
  - `preview-frame` 인스턴스 (선택된 테마/색 반영)
- **Right Panel** (우측 480px, fill `semantic/color/surface-panel`)
  - 상단 actions: `button-secondary` ("Trang chủ") + `button-primary` ("Lưu")
  - 각 단계별 폼 콘텐츠

### 6.3 인스턴스 사용
§5에서 만든 컴포넌트를 **인스턴스로만 배치**. 직접 그리지 말 것.
선택 상태는 인스턴스의 `state=selected` variant로 설정.

### 6.4 단계별 폼 구성
| Step | 제목 (VI) | 주요 폼 |
|---|---|---|
| 1 | Chọn giao diện | theme carousel + swatch-row |
| 2 | Cô dâu & chú rể | 이름/부모 이름/자녀 선택 (input-underline × N) |
| 3 | Lễ cưới | 날짜/시간/장소 |
| 4 | Câu chuyện | 사진 업로드 + 메시지 textarea |
| 5 | Hoàn thành | 미리보기 + "Xem toàn màn hình" 버튼 |

---

## 7. Phase 5 — Preview 화면 (Mobile 375)

`📱 04 · Preview (Mobile 375)` 페이지.

### 7.1 프레임
- Name: `preview-mobile--theme-{n}` (테마 8종 × 1 프레임 = 총 8개)
- Size: **375 × 812** (iPhone)
- Fill: `semantic/color/surface-canvas`

### 7.2 내용
에디터의 `preview-frame` 컴포넌트(390×844)를 375폭 뷰포트에 맞춰 배치.
8개 프레임 각각 다른 테마 이미지/색상 조합 반영.

---

## 8. Phase 6 — Final View (Mobile 375)

`📱 05 · Final View (Mobile 375)` 페이지. 최종 청첩장 열람 모드.

### 8.1 섹션 구조 (세로 스크롤 상정)
각 섹션을 개별 375폭 프레임으로 생성:
1. `final--01-cover` — 커버 (큰 사진 + 이름 + 날짜)
2. `final--02-invitation` — 초대 문구
3. `final--03-bride-groom` — 신랑신부 소개
4. `final--04-date` — 날짜/시간 카운트다운
5. `final--05-venue` — 장소 지도
6. `final--06-gallery` — 사진 앨범 그리드
7. `final--07-account` — 계좌 안내
8. `final--08-closing` — 마무리 인사

### 8.2 길이
각 섹션 높이는 콘텐츠에 맞춰 가변 (최소 600, 최대 1400).
모두 `flow` Auto Layout으로 스택 배치 → Figma prototype에서 스크롤 연결 가능.

---

## 9. 베트남어 카피 시트

목업 내 텍스트. 필요 시 Claude Code가 이 섹션의 값을 그대로 사용.

| 키 | 한국어 원본 | 베트남어 (목업 사용) |
|---|---|---|
| app.save | 저장 | Lưu |
| app.home | 홈으로 | Trang chủ |
| app.fullscreen | 전체화면 | Xem toàn màn hình |
| step.1 | 테마 선택 | Chọn giao diện |
| step.2 | 신랑신부 | Cô dâu & chú rể |
| step.3 | 예식 정보 | Lễ cưới |
| step.4 | 이야기 | Câu chuyện |
| step.5 | 완료 | Hoàn thành |
| form.bride | 신부 | Cô dâu |
| form.groom | 신랑 | Chú rể |
| form.lastName | 성 | Họ |
| form.firstName | 이름 | Tên |
| form.father | 아버지 | Bố |
| form.mother | 어머니 | Mẹ |
| form.son | 아들 | Con trai |
| form.daughter | 딸 | Con gái |
| theme.prev | 이전테마 | Giao diện trước |
| theme.next | 다음테마 | Giao diện sau |
| section.theme | 테마를 선택해주세요. | Hãy chọn giao diện. |
| section.basic | 기본정보를 입력해주세요. | Hãy nhập thông tin cơ bản. |
| caption.skipParents | · 부모 정보는 생략 가능 | · Thông tin bố mẹ có thể bỏ qua. |
| cover.simply | SIMPLY | SIMPLY |
| cover.meaning | MEANING | MEANING |
| cover.toBe | TO BE | TO BE |
| cover.together | TOGETHER | TOGETHER |

---

## 10. 실행 순서 요약 (Claude Code 체크리스트)

```
□ 0.  필수 파일 읽기 (tokens, spec, html)
□ 1.  Figma 파일 열기, join_channel
□ 2.  페이지 7개 생성 (§1)
□ 3.  Variables 6개 컬렉션 생성 + 모든 토큰 등록 (§2)
□ 4.  Paint / Effect / Text Styles 생성 (§3)
□ 5.  Foundations 페이지 작성 (§4)
□ 6.  Components 페이지 — 12개 컴포넌트 + variants (§5)
□ 7.  Editor 5개 프레임 (§6)
□ 8.  Preview 8개 프레임 (§7)
□ 9.  Final View 8개 섹션 (§8)
□ 10. 각 단계 완료마다 get_node / get_local_variables 로 검증
□ 11. 최종 리포트: 생성된 페이지/프레임/컴포넌트/변수 카운트
```

---

## 11. 에러 처리

- **폰트 누락** (SVN-Poppins 없음) → 시스템 fallback으로 대체하되, 리포트에 명시
- **Variable alias 실패** → Primitives 먼저 완성 후 Semantic 생성 (의존성 순서)
- **TalkToFigma 명령 실패** → 3회 retry, 그래도 실패하면 해당 항목 스킵하고 로그 남기고 다음 진행
- **Variant combine 실패** → 개별 컴포넌트로 먼저 생성 후 수동 combine 안내

---

## 12. 완료 기준 (Definition of Done)

- ✅ Variables 6개 컬렉션, 모든 토큰 등록 완료 (카운트 매칭)
- ✅ Paint / Effect / Text Styles 모두 생성
- ✅ 12개 컴포넌트 + 모든 variants 완성, 인스턴스화 가능
- ✅ Foundations / Editor / Preview / Final View 4개 페이지 채움
- ✅ 모든 프레임에 Auto Layout 적용
- ✅ 모든 fill/stroke가 variable binding (하드코딩 없음)
- ✅ 모든 텍스트가 Text Style 적용
- ✅ 모든 카피가 베트남어

---

*v1.0 · 2026-04-22 · TalkToFigma MCP edition*
