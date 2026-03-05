-- 게시글 테이블
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text not null default '',
  tags text[] not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.posts enable row level security;

-- 공개 글은 누구나 조회
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (is_public = true or auth.uid() = user_id);

-- 본인 글만 삽입
create policy "Users can insert own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

-- 본인 글만 수정
create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 본인 글만 삭제
create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- 인덱스
create index if not exists posts_user_id_idx on public.posts (user_id);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_is_public_idx on public.posts (is_public) where is_public = true;
