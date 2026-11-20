-- ============================================================================
-- PRISM — Supabase schema (free plan)
-- 실제 방문자 모두가 같은 글·댓글을 보고 쓸 수 있게 하는 최소 구성.
-- Supabase Dashboard → SQL Editor 에 이 파일 전체를 붙여 넣고 Run 하면 됩니다.
-- ============================================================================

-- 1) 글 -------------------------------------------------------------------
create table if not exists public.prism_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null check (char_length(title) between 2 and 120),
  description text        not null default '' check (char_length(description) <= 600),
  prompt      text        not null check (char_length(prompt) between 10 and 4000),
  tool        text        not null check (char_length(tool) between 1 and 40),
  category    text        not null default 'image'
                          check (category in ('image', 'app', 'video', 'automation')),
  tags        text[]      not null default '{}',
  image_url   text        check (image_url is null or char_length(image_url) <= 400000),
  nickname    text        not null check (char_length(nickname) between 1 and 24),
  handle      text        check (handle is null or char_length(handle) <= 40),
  likes       integer     not null default 0 check (likes >= 0),
  created_at  timestamptz not null default now()
);

create index if not exists prism_posts_created_at_idx
  on public.prism_posts (created_at desc);

-- 2) 댓글 -----------------------------------------------------------------
create table if not exists public.prism_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.prism_posts (id) on delete cascade,
  nickname   text not null check (char_length(nickname) between 1 and 24),
  body       text not null check (char_length(body) between 1 and 800),
  kind       text not null default 'general' check (kind in ('general', 'suggestion')),
  likes      integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists prism_comments_post_idx
  on public.prism_comments (post_id, created_at);

-- 3) RLS ------------------------------------------------------------------
alter table public.prism_posts    enable row level security;
alter table public.prism_comments enable row level security;

-- 읽기는 누구나(익명 포함)
drop policy if exists "prism_posts_read" on public.prism_posts;
create policy "prism_posts_read" on public.prism_posts
  for select using (true);

drop policy if exists "prism_comments_read" on public.prism_comments;
create policy "prism_comments_read" on public.prism_comments
  for select using (true);

-- 쓰기도 익명에게 열어 준다(로그인 없는 커뮤니티). 좋아요 수는 0으로만 생성 가능.
drop policy if exists "prism_posts_insert" on public.prism_posts;
create policy "prism_posts_insert" on public.prism_posts
  for insert to anon, authenticated
  with check (likes = 0 and created_at <= now() + interval '5 minutes');

drop policy if exists "prism_comments_insert" on public.prism_comments;
create policy "prism_comments_insert" on public.prism_comments
  for insert to anon, authenticated
  with check (likes = 0 and created_at <= now() + interval '5 minutes');

-- 수정·삭제 정책은 두지 않는다 → 익명은 글을 고치거나 지울 수 없다.
-- 좋아요는 아래 SECURITY DEFINER 함수로만 +1 된다.

-- 4) 좋아요 ---------------------------------------------------------------
create or replace function public.prism_like_post(p_post uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.prism_posts
     set likes = likes + 1
   where id = p_post
  returning likes;
$$;

create or replace function public.prism_like_comment(p_comment uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.prism_comments
     set likes = likes + 1
   where id = p_comment
  returning likes;
$$;

revoke all on function public.prism_like_post(uuid)    from public;
revoke all on function public.prism_like_comment(uuid) from public;
grant execute on function public.prism_like_post(uuid)    to anon, authenticated;
grant execute on function public.prism_like_comment(uuid) to anon, authenticated;

-- 5) 확인용 ---------------------------------------------------------------
select 'prism_posts' as table_name, count(*) from public.prism_posts
union all
select 'prism_comments', count(*) from public.prism_comments;
