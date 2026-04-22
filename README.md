# Promise Card 2026

베트남 현지 맞춤형 모바일 청첩장 서비스

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Backend/DB | Supabase (Auth + PostgreSQL + Storage) |
| i18n | next-intl (vi / ko) |
| Deployment | Vercel |

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
├── api/                     # NestJS 백엔드 (선택)
├── docs/                    # 기획·설계 문서
└── .mcp.json                # Figma MCP 설정
```

## 개발 시작

```bash
cd web
pnpm install
pnpm dev
```
