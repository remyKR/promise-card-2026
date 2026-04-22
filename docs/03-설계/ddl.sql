-- ============================================================
-- Promise Card 2026 — Supabase PostgreSQL DDL
-- 작성일: 2026-04-23
-- DB: Supabase (PostgreSQL 15)
-- 실행 방법: Supabase Dashboard → SQL Editor에 전체 붙여넣기 후 실행
-- ============================================================


-- ============================================================
-- 0. 타입 정의
-- ============================================================

create type card_status as enum ('draft', 'published');


-- ============================================================
-- 1. invitation_cards (청첩장)
-- ============================================================

create table public.invitation_cards (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  share_code    varchar(8) unique not null,   -- 공개 URL 코드 (앱에서 랜덤 생성)
  status        card_status not null default 'draft',

  -- 기본 정보
  groom_name    varchar(100),
  bride_name    varchar(100),
  groom_parents jsonb not null default '{"father": null, "mother": null, "father_deceased": false, "mother_deceased": false}'::jsonb,
  bride_parents jsonb not null default '{"father": null, "mother": null, "father_deceased": false, "mother_deceased": false}'::jsonb,

  -- 예식 일시
  wedding_date  timestamptz,

  -- 예식 장소
  venue_name    varchar(200),
  venue_hall    varchar(200),    -- 홀 이름 (예: 2층 그랜드홀)
  venue_address varchar(500),
  venue_phone   varchar(50),
  venue_lat     double precision,
  venue_lng     double precision,

  -- 메인 화면
  greeting_text text,
  theme_id      varchar(50) not null default 'classic',  -- 템플릿 ID (classic / modern / minimal)

  -- 기타 설정 (JSON)
  -- 구조 예시:
  -- {
  --   "font": "Noto Serif",
  --   "primary_color": "#B5886A",
  --   "bg_color": "#FDF9F5",
  --   "show_bride_first": false,
  --   "show_calendar": true,
  --   "gallery_type": "swipe",          -- "swipe" | "grid"
  --   "zoom_disabled": false,
  --   "map_locked": false,
  --   "rsvp_enabled": true,
  --   "guestbook_enabled": true,
  --   "donation_groups": [
  --     {
  --       "label": "신랑측",
  --       "accounts": [
  --         { "holder": "홍길동", "bank": "신한", "number": "110-123-456789" }
  --       ]
  --     },
  --     {
  --       "label": "신부측",
  --       "accounts": [
  --         { "holder": "김영희", "bank": "국민", "number": "123-45-678901" }
  --       ]
  --     }
  --   ]
  -- }
  settings      jsonb not null default '{}'::jsonb,

  -- 잠금 (null = 잠금 없음, 값이 있으면 해당 시각 이후 접근 불가)
  locked_at     timestamptz,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_invitation_cards_updated_at
  before update on public.invitation_cards
  for each row execute function public.handle_updated_at();

-- 인덱스
create index idx_invitation_cards_user_id   on public.invitation_cards(user_id);
create index idx_invitation_cards_status    on public.invitation_cards(status);
create index idx_invitation_cards_locked_at on public.invitation_cards(locked_at);


-- ============================================================
-- 2. card_gallery (갤러리 사진)
-- 한 청첩장에 최대 20장
-- ============================================================

create table public.card_gallery (
  id         uuid primary key default gen_random_uuid(),
  card_id    uuid not null references public.invitation_cards(id) on delete cascade,
  image_url  varchar(1000) not null,   -- Supabase Storage URL
  sort_order int not null default 0,   -- 정렬 순서 (0부터 시작)
  created_at timestamptz not null default now(),

  constraint card_gallery_sort_positive check (sort_order >= 0)
);

create index idx_card_gallery_card_id on public.card_gallery(card_id, sort_order);


-- ============================================================
-- 3. rsvp_responses (참석 여부 응답)
-- ============================================================

create table public.rsvp_responses (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.invitation_cards(id) on delete cascade,
  guest_name  varchar(100) not null,
  phone       varchar(50),
  attending   boolean not null,         -- true = 참석, false = 불참
  guest_count int check (guest_count >= 0),
  meal        boolean,                  -- 식사 여부
  message     text,                     -- 기타 전달사항
  created_at  timestamptz not null default now()
);

create index idx_rsvp_responses_card_id on public.rsvp_responses(card_id, created_at);


-- ============================================================
-- 4. guestbook_entries (방명록)
-- ============================================================

create table public.guestbook_entries (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.invitation_cards(id) on delete cascade,
  author_name varchar(100) not null,
  message     text not null,
  is_public   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index idx_guestbook_entries_card_id on public.guestbook_entries(card_id, created_at);


-- ============================================================
-- 5. RLS (Row Level Security) — 접근 제어
-- "누가 어떤 데이터를 볼 수 있는가"를 DB 레벨에서 강제
-- ============================================================

alter table public.invitation_cards  enable row level security;
alter table public.card_gallery       enable row level security;
alter table public.rsvp_responses     enable row level security;
alter table public.guestbook_entries  enable row level security;


-- ─── invitation_cards RLS ───────────────────────────────────

-- 공개 청첩장은 누구나 열람 (published + 잠금 전)
create policy "공개 청첩장 열람"
  on public.invitation_cards for select
  using (
    status = 'published'
    and (locked_at is null or locked_at > now())
  );

-- 본인 청첩장은 상태 무관하게 조회 가능
create policy "본인 청첩장 조회"
  on public.invitation_cards for select
  using (auth.uid() = user_id);

create policy "본인 청첩장 생성"
  on public.invitation_cards for insert
  with check (auth.uid() = user_id);

create policy "본인 청첩장 수정"
  on public.invitation_cards for update
  using (auth.uid() = user_id);

create policy "본인 청첩장 삭제"
  on public.invitation_cards for delete
  using (auth.uid() = user_id);


-- ─── card_gallery RLS ───────────────────────────────────────

-- 공개 청첩장의 갤러리는 누구나 열람
create policy "공개 갤러리 열람"
  on public.card_gallery for select
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id
        and c.status = 'published'
        and (c.locked_at is null or c.locked_at > now())
    )
  );

-- 본인 갤러리는 항상 조회 가능
create policy "본인 갤러리 조회"
  on public.card_gallery for select
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );

create policy "본인 갤러리 추가"
  on public.card_gallery for insert
  with check (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );

create policy "본인 갤러리 수정"
  on public.card_gallery for update
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );

create policy "본인 갤러리 삭제"
  on public.card_gallery for delete
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );


-- ─── rsvp_responses RLS ─────────────────────────────────────

-- 공개 청첩장에는 누구나 RSVP 제출 가능 (비로그인 포함)
create policy "RSVP 제출"
  on public.rsvp_responses for insert
  with check (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id
        and c.status = 'published'
        and (c.locked_at is null or c.locked_at > now())
    )
  );

-- 청첩장 소유자만 RSVP 목록 조회
create policy "본인 RSVP 조회"
  on public.rsvp_responses for select
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );


-- ─── guestbook_entries RLS ──────────────────────────────────

-- 공개 방명록은 누구나 열람
create policy "공개 방명록 열람"
  on public.guestbook_entries for select
  using (
    is_public = true
    and exists (
      select 1 from public.invitation_cards c
      where c.id = card_id
        and c.status = 'published'
        and (c.locked_at is null or c.locked_at > now())
    )
  );

-- 청첩장 소유자는 비공개 포함 전체 조회
create policy "본인 방명록 전체 조회"
  on public.guestbook_entries for select
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );

-- 공개 청첩장에는 누구나 방명록 작성 (비로그인 포함)
create policy "방명록 작성"
  on public.guestbook_entries for insert
  with check (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id
        and c.status = 'published'
        and (c.locked_at is null or c.locked_at > now())
    )
  );

-- 청첩장 소유자만 방명록 삭제
create policy "본인 방명록 삭제"
  on public.guestbook_entries for delete
  using (
    exists (
      select 1 from public.invitation_cards c
      where c.id = card_id and c.user_id = auth.uid()
    )
  );


-- ============================================================
-- 6. Supabase Storage 버킷 설정 (SQL Editor가 아닌 대시보드에서 설정)
-- ============================================================
-- Bucket 이름: "card-images"
-- Public 여부: false (URL로 직접 접근 불가, Supabase URL을 통해서만 접근)
-- 허용 MIME 타입: image/jpeg, image/png, image/webp
-- 최대 파일 크기: 10MB
--
-- Storage 정책 (대시보드 Storage → Policies):
-- - 업로드: 로그인 사용자만 자신의 폴더(user_id/)에 업로드 가능
-- - 열람: 공개 카드에 연결된 이미지는 누구나 열람 가능
-- ============================================================
