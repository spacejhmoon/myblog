-- profiles 테이블: 회원가입 시 auth.users와 함께 저장할 프로필 정보
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nickname text not null,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS 활성화
alter table public.profiles enable row level security;

-- 본인 프로필 조회
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 본인 프로필 삽입 (회원가입 직후)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 본인 프로필 수정
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- (선택) 회원가입 시 auth.users 메타데이터로 자동 생성하려면 트리거 사용
-- signUp 시 options.data에 { nickname, bio } 를 넘기면 트리거에서 채움
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, nickname, bio)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nickname', ''),
    nullif(trim(new.raw_user_meta_data->>'bio'), '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
