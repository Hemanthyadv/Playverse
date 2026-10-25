import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../../supabase/migrations/202610250001_online_play_foundation.sql", import.meta.url),
  "utf8",
);

describe("online-play SQL security contract", () => {
  it("enables row-level security and does not grant direct score writes", () => {
    expect(migration).toContain("alter table public.player_profiles enable row level security");
    expect(migration).toContain("alter table public.game_scores enable row level security");
    expect(migration).toMatch(/revoke insert, update, delete on public\.game_scores from anon, authenticated/i);
    expect(migration).not.toMatch(/create policy[^;]+on public\.game_scores for insert/i);
  });

  it("binds score submissions to the authenticated guest/player identity", () => {
    expect(migration).toContain("current_player := auth.uid()");
    expect(migration).toContain("if current_player is null");
    expect(migration).toContain("player_id, game_id, score, mode, challenge_date");
  });

  it("validates supported games, score caps, modes, and daily challenge dates", () => {
    expect(migration).toContain("'size-it-up', 'higher-or-lower', 'daily-quiz'");
    expect(migration).toContain("p_score > 500");
    expect(migration).toContain("p_score > 100");
    expect(migration).toContain("p_mode is null or p_mode not in ('daily', 'practice')");
    expect(migration).toContain("p_mode = 'daily' and p_challenge_date is null");
  });

  it("prevents duplicate daily scores and limits public fields to leaderboard-safe data", () => {
    expect(migration).toContain("where mode = 'daily'");
    expect(migration).toContain("create unique index if not exists game_scores_one_daily_entry");
    expect(migration).toContain("create or replace view public.leaderboard_entries");
    expect(migration).not.toMatch(/select\s+\*\s+from\s+auth\.users/i);
  });
});
