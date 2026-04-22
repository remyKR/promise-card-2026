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

> 새로운 기능을 구현하기 전에 반드시 해당 문서를 먼저 확인한다.

```
docs/
├── 01-기획/
│   ├── 서비스-개요.md       # 서비스 목적·타겟·핵심 가치·KPI
│   ├── MVP-범위.md          # P1/P2/P3 기능 분류
│   ├── 로드맵.md            # 6주 개발 일정
│   └── 경쟁사-분석.md      # 베트남 모바일 청첩장 5개 플랫폼 분석
├── 02-정책/
│   ├── 인증-정책.md         # Google·Facebook OAuth + OTP/Twilio Verify (Decree 147)
│   ├── 서비스-정책.md       # 청첩장 유효기간·잠금·업로드 제한
│   └── 운영-정책.md         # 요금 구조·개인정보·고객지원
├── 03-설계/
│   ├── 아키텍처.md          # 시스템 구조 전체 개요 (큰 그림)
│   ├── 개발가이드.md        # 협업 개발자용 — 폴더 구조·네이밍·Figma→Tailwind
│   ├── ddl.sql              # DB 스키마 전체 (PostgreSQL DDL + RLS)
│   └── 화면명세/
│       ├── 01-홈(랜딩).md   # 랜딩 페이지
│       ├── 02-에디터.md     # 청첩장 에디터 (40개 기능 명세)
│       ├── 03-인증.md       # 로그인·전화번호 OTP 인증
│       ├── 04-청첩장열람.md  # 공개 청첩장 열람·RSVP·방명록
│       ├── 05-마이페이지.md  # 내 청첩장 목록·복사·계정 설정
│       └── 06-템플릿.md     # 3종 템플릿 색상·폰트·settings 스펙
└── decisions.md             # 주요 결정 사항 로그 (매 세션 자동 업데이트)
```

### 협업 개발자라면

`docs/03-설계/개발가이드.md` 를 먼저 읽는다.  
폴더 구조, 네이밍 규칙, 컴포넌트 설계 원칙, 브랜치 전략이 모두 담겨 있다.

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
