# Playverse online play foundation

## Scope of this milestone

This PR adds the database schema and security boundary for guest-first identity and shared score storage. It does not activate online features in the React UI yet; local games continue to work without a backend. A later integration PR will connect the frontend after a Supabase project is configured.

## Free-tier-first setup

1. Create a Supabase project and check its current free-tier quotas, limits and inactivity rules before production use.
2. In Supabase Authentication settings, enable **Anonymous Sign-Ins**.
3. Run `supabase/migrations/202610250001_online_play_foundation.sql` in the SQL Editor in a test project first.
4. Confirm that `player_profiles`, `game_scores`, `leaderboard_entries` and `submit_game_score` were created.
5. Never put a Supabase service-role key in browser code or commit it. The future browser client may use only the project URL and publishable/anon key, with Row Level Security enabled.

## Included protections

- Anonymous/authenticated user identity is bound to `auth.uid()` for score submissions.
- Supported game IDs and score caps are checked by the database.
- Daily results require a date and a unique index prevents duplicate daily submissions for the same player/game/date.
- Scores have no direct client INSERT/UPDATE/DELETE policy; writes go through the score RPC.
- The public leaderboard view contains display names and scores, not emails or auth metadata.

These protections are a baseline, not full anti-cheat. A modified client could still submit a fabricated score within the allowed cap. Competitive leaderboards need server-side replay/round validation or server recomputation, throttling and abuse moderation.

## Example queries

Practice score submission after anonymous sign-in:

```sql
select * from public.submit_game_score('size-it-up', 350, 'practice', null);
```

Daily score submission:

```sql
select * from public.submit_game_score('daily-quiz', 80, 'daily', current_date);
```

Read the top scores for one game:

```sql
select game_id, display_name, score, mode, challenge_date, created_at
from public.leaderboard_entries
where game_id = 'size-it-up'
order by score desc, created_at asc
limit 100;
```

## Not yet implemented

The migration has not been applied to a live project and no frontend auth/leaderboard screen is enabled by this PR. Account linking/recovery, public matchmaking, private rooms, synchronized game state, reconnect behavior, abuse controls and load tests remain future milestones. No 1,000-concurrent-player capacity is claimed until realistic load tests cover auth, score submissions, leaderboard reads and real-time traffic.
