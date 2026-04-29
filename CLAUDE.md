# Promise Card 2026 — Claude 개발 가이드

## ⚠️ 개발 철학 (항상 준수)

**기획·정책·설계가 먼저다.** 문서 없이 구현하지 않는다.

```
docs/01-기획/  →  docs/02-정책/  →  docs/03-설계/  →  구현
```

- 새 기능 요청 시: 해당 설계 문서가 있는지 먼저 확인
- 설계 문서가 없으면: 문서 작성 후 구현 시작
- 설계와 다른 구현: 설계 문서를 업데이트하거나 사용자에게 확인

---

## ⚠️ 세션 시작 시 필수 행동 (MANDATORY)

1. `docs/decisions.md` 를 반드시 읽어 이전 결정 사항 파악
2. 사용자에게 "지난 세션 요약" 한 줄 브리핑 후 작업 시작

## ⚠️ 세션 중 필수 행동 (MANDATORY)

대화 중 아래 항목이 결정되면 **즉시** `docs/decisions.md`에 추가:
- 기술 스택 변경 또는 제거
- 기능 포함/제외 결정
- 비즈니스 방향 변경
- 폴더 구조·네이밍 규칙 변경
- 외부 서비스·API 선택

## ⚠️ Figma 연결 규칙 (MANDATORY)

**Figma 작업은 반드시 공식 Figma MCP/Skills로만 수행한다.**

- ✅ **사용**: `plugin:figma:figma` MCP 서버 (`use_figma`, `get_design_context`, `get_screenshot` 등)
- ✅ **사용**: `figma:figma-use` 스킬 (write 작업 전 필수 prerequisite)
- ✅ **사용**: `figma:figma-implement-design`, `figma:figma-generate-design`, `figma:figma-code-connect` 등
- ❌ **사용 금지**: TalkToFigma MCP (cursor-talk-to-figma-mcp) — 비공식 도구이므로 제외
- **이유**: 공식 Figma MCP가 Code Connect, Design Tokens, 디자인 컨텍스트 등 더 풍부한 통합 제공
- **연결 방식**: 사용자가 Figma URL(`figma.com/design/...`) 또는 nodeId 공유 → Claude는 공식 MCP로 접근

### 📌 프로젝트 Figma 파일 URL (변경 시 즉시 갱신)

| 화면 | URL | fileKey | nodeId |
|---|---|---|---|
| **edit (에디터)** | https://www.figma.com/design/SxYKVampdcWagoaiBohmNJ/UI-final?node-id=1-1244 | `SxYKVampdcWagoaiBohmNJ` | `1:1244` |

**규칙**:
- 사용자가 "edit 파일 편집" / "에디터 디자인 수정" 등을 요청하면 위 URL/nodeId를 **자동으로 사용**한다 (재확인 불필요)
- 새 화면(홈, 청첩장 열람, 마이페이지 등) URL이 공유되면 위 표에 추가
- nodeId 표기: URL의 `node-id=1-1244` → MCP 호출 시 `1:1244` (하이픈을 콜론으로 변환)

형식:
```
## YYYY-MM-DD
### 결정 제목
- **결정**: 내용
- **이유**: 이유
```

---

## 프로젝트 개요
베트남 현지 맞춤형 모바일 청첩장 서비스. 사용자는 Figma로 디자인 후 Claude Code로 구현하는 바이브 코딩 방식으로 개발한다.

- **사용 언어**: 베트남어 (UI 텍스트), 한국어 (코드 주석·문서)
- **타겟**: 베트남 거주 커플 (모바일 우선)

---

## 기술 스택 (변경 금지)

| 역할 | 기술 | 버전 |
|---|---|---|
| 프레임워크 | Next.js App Router | ^15 |
| 언어 | TypeScript | ^5 (strict) |
| 스타일 | Tailwind CSS | ^4 |
| 백엔드/DB | Supabase | ^2 |
| 패키지 매니저 | pnpm | 10.x |

**절대 추가 금지**: Redux, MobX, Styled Components, CSS Modules (Tailwind만 사용)
**절대 추가 금지**: axios (Next.js fetch 또는 Supabase client 사용)

---

## 폴더 구조 규칙

```
web/src/
├── app/                  # 페이지만 위치 (로직 최소화)
│   ├── (auth)/           # 로그인/회원가입 그룹
│   ├── card/[code]/      # 공개 청첩장 열람
│   ├── create/           # 청첩장 에디터
│   ├── my/               # 마이페이지
│   └── api/              # API Routes
├── components/
│   ├── ui/               # 버튼, 인풋 등 기본 UI
│   └── features/         # 청첩장, 에디터 등 기능 컴포넌트
├── lib/
│   └── supabase/         # Supabase 클라이언트 (server.ts, client.ts)
├── hooks/                # 커스텀 훅 (use로 시작)
└── types/                # TypeScript 타입 정의
```

---

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `InvitationCard.tsx` |
| 훅 파일 | camelCase, use 접두사 | `useInvitation.ts` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| 타입/인터페이스 | PascalCase, 접미사 Type/Props | `InvitationCardProps` |
| Supabase 테이블 | snake_case | `invitation_cards` |
| 환경변수 | NEXT_PUBLIC_ 접두사 (공개) | `NEXT_PUBLIC_SUPABASE_URL` |

---

## 코드 품질 규칙 (반드시 준수)

### TypeScript
- `any` 타입 사용 금지 — 모르면 `unknown` 사용 후 좁히기
- 모든 함수 반환 타입 명시
- `!` (non-null assertion) 남용 금지 — 반드시 null 체크 후 사용

### React / Next.js
- Server Component 우선, 클라이언트 상태가 필요할 때만 `'use client'` 추가
- `useEffect`에서 fetch 금지 — Server Component 또는 Server Action 사용
- 이미지는 반드시 `next/image` 사용
- 링크는 반드시 `next/link` 사용

### Supabase
- DB 조작은 반드시 Server Component 또는 Server Action에서만
- RLS(Row Level Security) 활성화 전제로 코드 작성
- 환경변수는 반드시 `.env.local`에서 읽기 (하드코딩 절대 금지)

---

## 안전 체크리스트 (작업 완료 전 반드시 실행)

```bash
# 1. 타입 오류 확인 (오류 있으면 작업 미완성)
cd web && pnpm type-check

# 2. 린트 확인
cd web && pnpm lint

# 3. 빌드 확인 (배포 전)
cd web && pnpm build
```

**Claude에게**: 기능 구현 후 반드시 위 체크리스트를 실행하고 오류가 없을 때만 완료라고 보고할 것.

---

## 환경변수 관리

- `.env.local` — 실제 값 (절대 git에 커밋 금지, .gitignore에 포함됨)
- `.env.example` — 키 이름만 기재, 값 없음 (git에 커밋 OK)

새 환경변수 추가 시 `.env.example`에도 반드시 반영.

---

## 바이브 코딩 워크플로우

사용자는 개발 초보이므로 Claude는 아래 순서를 항상 제안한다:

```
1. [사용자] Figma에서 화면 디자인
2. [Claude] Figma에서 디자인 읽기 (공식 Figma MCP — `plugin:figma:figma`)
3. [Claude] 컴포넌트 구현
4. [Claude] pnpm type-check 실행 → 오류 수정
5. [사용자] 브라우저에서 확인
6. [Claude] git commit & push
```

---

## 자주 쓰는 명령어

```bash
# 개발 서버 실행
cd web && pnpm dev

# 타입 체크
cd web && pnpm type-check

# 린트
cd web && pnpm lint

# 빌드
cd web && pnpm build

# 의존성 설치
cd web && pnpm install
```

---

## Supabase 연결 패턴

```typescript
// lib/supabase/server.ts — 서버용 (Server Component, Server Action)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// lib/supabase/client.ts — 클라이언트용 ('use client' 컴포넌트)
import { createBrowserClient } from '@supabase/ssr'
```

---

## 오류 처리 패턴

```typescript
// Supabase 결과는 항상 error 체크
const { data, error } = await supabase.from('invitation_cards').select()
if (error) {
  console.error('청첩장 조회 실패:', error.message)
  return null
}
```

---

## 커밋 메시지 규칙

```
feat: 새 기능 추가
fix: 버그 수정
style: UI/스타일 변경
refactor: 코드 리팩토링
docs: 문서 수정
chore: 설정, 패키지 변경
```

예시: `feat: 청첩장 생성 폼 구현`
