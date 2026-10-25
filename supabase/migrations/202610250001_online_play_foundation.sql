-- Playverse online-play foundation. Apply only after reviewing in a test Supabase project.
-- Anonymous Supabase Auth users receive auth.uid() and use the authenticated role.

create table if not exists public.player_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint player_profiles_display_name_trimmed check (display_name = btrim(display_name))
);

create table if not exists public.game_scores (
  id bigint generated always as identity primary key,
  player_id uuid not null references public.player_profiles(id) on delete cascade,
  game_id text not null check (game_id in ('size-it-up', 'higher-or-lower', 'daily-quiz')),
  score integer not null check (score >= 0),
  mode text not null default 'practice' check (mode in ('daily', 'practice')),
  challenge_date date,
  created_at timestamptz not null default now(),
  constraint game_scores_game_cap check (
    (game_id = 'size-it-up' and score <= 500) or
    (game_id in ('higher-or-lower', 'daily-quiz') and score <= 100)
  ),
  constraint game_scores_daily_date check (
    (mode = 'daily' and challenge_date is not null) or
    (mode = 'practice' and challenge_date is null)
  )
);

create index if not exists game_scores_leaderboard_idx on public.game_scores (game_id, score desc, created_at asc);
create index if not exists game_scores_player_idx on public.game_scores (player_id, created_at desc);
create unique index if not exists game_scores_one_daily_entry
  on public.game_scores (player_id, game_id, challenge_date) where mode = 'daily';

alter table public.player_profiles enable row level security;
alter table public.game_scores enable row level security;

drop policy if exists "Public can read player display names" on public.player_profiles;
create policy "Public can read player display names" on public.player_profiles for select to anon, authenticated using (true);
drop policy if exists "Players can update their own display name" on public.player_profiles;
create policy "Players can update their own display name" on public.player_profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Public can read scores" on public.game_scores;
create policy "Public can read scores" on public.game_scores for select to anon, authenticated using (true);
-- Intentionally no direct write policy on scores. Submit via the RPC below.

create or replace function public.create_player_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare requested_name text;
begin
  requested_name := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  if char_length(requested_name) < 1 or char_length(requested_name) > 24 or requested_name !~ '^[[:alnum:] _.-]+$' then
    requested_name := 'Guest-' || left(replace(new.id::text, '-', ''), 6);
  end if;
  insert into public.player_profiles (id, display_name) values (new.id, requested_name) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_playverse_profile on auth.users;
create trigger on_auth_user_created_playverse_profile after insert on auth.users for each row execute procedure public.create_player_profile();

create or replace function public.submit_game_score(p_game_id text, p_score integer, p_mode text default 'practice', p_challenge_date date default null)
returns public.game_scores language plpgsql security definer set search_path = '' as $$
declare current_player uuid; inserted_score public.game_scores;
begin
  current_player := auth.uid();
  if current_player is null then raise exception 'Guest session required before submitting a score' using errcode = '28000'; end if;
  if p_game_id not in ('size-it-up', 'higher-or-lower', 'daily-quiz') then raise exception 'Unsupported game ID' using errcode = '22023'; end if;
  if p_score is null or p_score < 0 or (p_game_id = 'size-it-up' and p_score > 500) or (p_game_id in ('higher-or-lower', 'daily-quiz') and p_score > 100) then
    raise exception 'Score is outside the allowed range for this game' using errcode = '22023';
  end if;
  if p_mode not in ('daily', 'practice') then raise exception 'Unsupported game mode' using errcode = '22023'; end if;
  if (p_mode = 'daily' and p_challenge_date is null) or (p_mode = 'practice' and p_challenge_date is not null) then
    raise exception 'Daily scores require a challenge date; practice scores must not have one' using errcode = '22023';
  end if;
  insert into public.game_scores (player_id, game_id, score, mode, challenge_date) values (current_player, p_game_id, p_score, p_mode, p_challenge_date) returning * into inserted_score;
  return inserted_score;
end;
$$;

revoke all on function public.submit_game_score(text, integer, text, date) from public;
grant execute on function public.submit_game_score(text, integer, text, date) to authenticated;

create or replace view public.leaderboard_entries with (security_invoker = true) as
select scores.game_id, profiles.display_name, scores.score, scores.mode, scores.challenge_date, scores.created_at
from public.game_scores scores join public.player_profiles profiles on profiles.id = scores.player_id;
grant select on public.leaderboard_entries to anon, authenticated;
