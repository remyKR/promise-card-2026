# FIGMA_BUILD.md — Claude Code 실행 지시서

**목표**: 이 프로젝트의 디자인 시스템을 `talk-to-figma` MCP를 통해 현재 열려있는 Figma 파일(기존 `B` 프레임이 있는 파일)에 **자동 재현**한다.

**입력 파일**:
- `design-tokens.json` — W3C DTCG 포맷 (Figma Variables 생성용)
- `components.spec.json` — 9개 컴포넌트 + `B` 스크린 레이어 스펙
- `tokens.css` — 참고용 CSS
- `Design System.html` — 렌더링된 디자인 참고
- `assets/fonts/SVN-Poppins.ttf`, `assets/logo/diamond.svg`, `assets/logo/promise-card-wordmark.png`

**대상 Figma 파일**: 현재 채널에 연결된 파일. `B` 프레임이 이미 존재한다.

---

## 작업 순서 (5 단계)

### Phase 0 — 준비
1. `mcp_TalkToFigma_join_channel`로 채널 확인
2. `get_document_info`로 현재 파일 구조 파악 (`B` 프레임 보존 필요)
3. 새 페이지 3개 생성:
   - `🎨 Tokens` — Variable 갤러리 시각화
   - `🧩 Components` — 컴포넌트 라이브러리
   - `📱 Screens` — `B` 스크린 재현 (기존 `Page 1`의 `B`는 건드리지 말고 복제본을 이 페이지에 생성)
   - ※ `create_page`가 없는 버전이면 기존 페이지 하단에 큰 `Section` 3개로 분리

### Phase 1 — Variables 생성 (`design-tokens.json` 기반)

`design-tokens.json`의 `_meta.figma.collections`를 읽고 6개 Collection 순차 생성:

```
FOR collection IN [Primitives, Semantic, Typography, Spacing, Radius, Shadow]:
  create_variable_collection(name=collection.name, modes=collection.modes)

FOR token IN design-tokens.json (recursive):
  path = dot.notation.path (e.g. "color.gray.900")
  IF token.$value starts with "{" → reference alias (resolve later in Phase 1b)
  ELSE → create_variable(collection, name=path, type=token.$type, value=token.$value)
```

**중요 규칙**:
- Variable 이름에 `/` 사용 (Figma 관례): `color.gray.900` → `color/gray/900`
- Color는 hex 또는 rgb(a) 그대로
- Primitives 먼저, 그 다음 Semantic(alias), Typography → Spacing → Radius → Shadow 순서

**Phase 1b — Alias 해결**:
- Semantic 토큰의 `{Primitives.color.gray.900}` 같은 참조는, Primitives가 전부 생성된 후 2차 pass로 `set_variable_alias`를 호출해 연결

**검증**: `get_local_variables`로 총 개수 확인 (대략 100+ 변수)

### Phase 2 — Components 생성 (`components.spec.json` 기반)

`🧩 Components` 페이지에 큰 오토레이아웃 프레임 하나를 만들고(`name="Component Library"`, vertical, gap 80) 각 컴포넌트를 세로로 쌓는다.

각 컴포넌트는 다음 순서로:

```
FOR comp IN components.spec.json.components:
  1. create_frame(name=comp.name, layout=comp.layout) 
  2. FOR child IN comp.children → 재귀 생성
     - type="text"  → create_text, set typography via Variable
     - type="frame" → create_frame, apply fill/border Variable
     - type="icon"  → create_vector (chevron은 path 직접 생성)
     - type="image" → set_image_fill (assets 업로드는 사용자가 수동)
  3. 모든 fill/stroke/cornerRadius에 `var:` 프리픽스가 있으면 → bind_variable
  4. comp.variants 있으면 → create_component_set with variant properties
```

**컴포넌트 목록 (순서)**:
1. `Logo`
2. `Button/Primary`, `Button/Secondary`, `Button/Ghost`
3. `Input/Underline` (variants: empty / filled)
4. `Select/Underline` (variants: empty / filled)
5. `Swatch/Circle` (variants: default / selected, instances: 7색)
6. `ThemeCard` (variants: default / selected)
7. `Stepper`
8. `ThemePagination`
9. `PreviewFrame`
10. `SectionHeader`

**핵심 팁**:
- 오토레이아웃 방향/정렬/패딩은 `components.spec.json`의 `layout` 그대로
- underline은 `border.bottom` 프로퍼티가 아니라 **바닥에 2px 높이 프레임**으로 구현 (Figma는 선택적 border가 제한적)
- chevron 아이콘은 8×8 vector path: `M 1 1 L 4 4 L 7 1` (회전 적용)
- Typography 바인딩은 Figma Variables 제한으로 개별 속성(fontFamily, fontSize, fontWeight)만 가능

### Phase 3 — `B` Screen 재현

`📱 Screens` 페이지(또는 섹션)에:

```
1. create_frame(name="B — Recreated", width=1920, height=1372, fill=var:Primitives.color.cream.100)
2. components.spec.json.screens[0].regions 순회:
   - Header (Logo 인스턴스)
   - Preview Area (이미지 + ThemePagination 인스턴스 + PreviewFrame 인스턴스)
   - Right Panel (480×1372, 흰색) - 내부에:
     · Top actions (Button/Secondary + Button/Primary 인스턴스)
     · Theme picker section (SectionHeader + ThemeCard×5 + Stepper + Swatch×7)
     · Form section (SectionHeader + Input×N + Select×N + caption)
3. 모든 요소는 Phase 2에서 만든 컴포넌트의 인스턴스로 생성
   (create_component_instance)
```

### Phase 4 — 검증 & 마무리

1. `get_node_info`로 최상위 프레임들 확인
2. 누락된 variable binding 검사 (eyedropper 대신 각 노드의 `boundVariables` 확인)
3. Figma 파일에서 `B` 원본과 `B — Recreated` 비교 — 사용자가 직접

---

## talk-to-figma MCP 명령 참조표

| 목적 | 명령 예시 |
|---|---|
| Variable 생성 | `create_variable_collection`, `create_variable`, `set_variable_mode_value`, `set_variable_alias` |
| 프레임 | `create_frame`, `set_auto_layout`, `set_padding`, `set_layout_sizing` |
| 셰이프 | `create_rectangle`, `create_ellipse`, `create_vector` |
| 텍스트 | `create_text`, `set_font_name`, `set_font_size`, `set_text_content` |
| 스타일 | `set_fill_color`, `set_stroke_color`, `set_corner_radius`, `set_effect` |
| 바인딩 | `bind_variable_to_node` (fills / strokes / cornerRadius / padding / itemSpacing 등) |
| 컴포넌트 | `create_component`, `create_component_set`, `create_component_instance` |
| 페이지/조회 | `create_page`(있으면), `get_document_info`, `get_node_info`, `get_local_variables` |

## 네이밍 규약

- Variable: `color/primitives/gray/900`, `color/semantic/text/primary`, `spacing/4`, `typography/size/md`
- Component: `Button/Primary`, `Input/Underline`, `ThemeCard`
- Variant property: `state=default`, `state=selected`
- Screen: `B — Recreated`

## 폰트 주의

- `SVN-Poppins` Regular/Bold는 Figma에 사전 설치돼 있어야 함 (`uploads/SVN-Poppins.ttf` 파일을 사용자가 OS에 설치 필요)
- `SUIT`는 로고 전용. 없으면 fallback으로 `Poppins Bold` 사용

## 실행 방법 (Cursor에서)

1. Cursor에서 이 프로젝트 열기
2. Figma 데스크톱 앱에서 대상 파일 열고 talk-to-figma 플러그인 실행 → 채널 ID 복사
3. Cursor Claude Code에 아래 프롬프트 주입:

> `@FIGMA_BUILD.md` 를 읽고 Phase 0부터 Phase 4까지 순서대로 실행해줘. `design-tokens.json`, `components.spec.json`를 입력으로 사용하고, 먼저 채널 `<CHANNEL_ID>`에 조인해. Phase 완료마다 진행 상황 보고해줘.

각 Phase가 길어지므로 중간에 끊기면 "Phase N부터 이어서" 라고 지시하면 됨.
