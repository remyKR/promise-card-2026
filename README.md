# Promise Card 2026

베트남 현지 맞춤형 모바일 청첩장 서비스

---

## 개발 철학 (필독)

> **기획·정책·설계가 먼저다.**

코드 작성 전에 `docs/` 문서가 완성되어 있어야 한다.  
Claude Code와 개발자는 문서를 정확하게 구현하는 역할이다.  
문서 없이 구현하지 않는다.

```
docs/01-기획/  →  docs/02-정책/  →  docs/03-설계/  →  구현
```

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Backend/DB | Supabase (Auth + PostgreSQL + Storage) |
| Deployment | Vercel |

---

## 문서 구조

```
docs/
├── 01-기획/
│   ├── 서비스-개요.md       # 서비스 목적·타겟·KPI·리스크
│   ├── MVP-범위.md          # P1/P2/P3 기능 분류
│   └── 로드맵.md            # 6주 개발 일정
├── 02-정책/
│   ├── 인증-정책.md         # Google·Facebook·OTP·Decree 147
│   ├── 서비스-정책.md       # 유효기간·잠금·업로드 제한
│   └── 운영-정책.md         # 요금·개인정보·고객지원
├── 03-설계/
│   ├── IA.md                # 정보 아키텍처 (사이트맵·URL)
│   ├── 아키텍처.md          # 시스템·DB·API·인증·보안 설계
│   ├── ddl.sql              # DB DDL
│   └── 화면명세/
│       └── 02-에디터.md     # 청첩장 에디터 40개 기능 명세
├── _templates/              # 분석서·보고서 템플릿 (출시 후 사용)
└── decisions.md             # 주요 결정 사항 로그 (매 세션 자동 업데이트)
```

---

## 프로젝트 구조

```
promise-card-2026/
├── web/                     # Next.js 15 프론트엔드
│   └── src/
│       ├── app/             # App Router 페이지
│       ├── components/      # UI 컴포넌트
│       ├── lib/supabase/    # Supabase 클라이언트
│       ├── hooks/           # 커스텀 훅
│       └── types/           # TypeScript 타입
├── docs/                    # 기획·정책·설계 문서
├── CLAUDE.md                # Claude Code 개발 규칙 (AI 지시서)
└── .mcp.json                # Figma MCP 설정
```

---

## 개발 시작

```bash
cd web
pnpm install
pnpm dev
```
