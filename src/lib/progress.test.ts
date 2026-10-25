import { describe, expect, it } from "vitest";
import type { SavedGame } from "./gameHistory";
import { progressAchievements, summarizeProgress } from "./progress";

const game = (id: string, date: string, mode: "daily" | "practice", score: number): SavedGame => ({
  id,
  challengeId: mode === "daily" ? `size-it-up-${date}` : `practice-${id}`,
  mode,
  playedAt: `${date}T12:00:00.000Z`,
  date,
  totalScore: score,
  maxScore: 500,
  rounds: [
    { object: "Bottle", guess: 24, actual: 24, score: 100, errorPercent: 0 },
    { object: "Book", guess: 15, actual: 20, score: 62, errorPercent: 25 },
  ],
});

describe("local progress summary", () => {
  it("returns clear zero states for a new player", () => {
    expect(summarizeProgress([])).toMatchObject({
      gamesPlayed: 0,
      totalPoints: 0,
      bestScore: 0,
      averageScore: 0,
      averageErrorPercent: null,
      dailyChallengesCompleted: 0,
      longestDailyStreak: 0,
      perfectRounds: 0,
    });
  });

  it("calculates scores, accuracy, perfect rounds and consecutive daily streaks", () => {
    const summary = summarizeProgress([
      game("d1", "2026-10-20", "daily", 450),
      game("d2", "2026-10-21", "daily", 400),
      game("p1", "2026-10-22", "practice", 300),
      game("d3", "2026-10-22", "daily", 500),
    ]);
    expect(summary).toMatchObject({
      gamesPlayed: 4,
      totalPoints: 1650,
      bestScore: 500,
      averageScore: 413,
      averageErrorPercent: 13,
      dailyChallengesCompleted: 3,
      longestDailyStreak: 3,
      perfectRounds: 4,
    });
  });

  it("excludes trivia and number-guessing rounds from estimation accuracy", () => {
    const estimation = game("estimate", "2026-10-20", "practice", 162);
    const quiz: SavedGame = {
      ...game("quiz", "2026-10-20", "practice", 80),
      gameId: "daily-quiz",
      gameTitle: "Daily Quiz",
      rounds: [{ object: "Which planet is red?", guess: 0, actual: 1, score: 0, errorPercent: 100 }],
    };
    const higherOrLower: SavedGame = {
      ...game("numbers", "2026-10-21", "practice", 20),
      gameId: "higher-or-lower",
      gameTitle: "Higher or Lower",
      rounds: [{ object: "Round 1", guess: 1, actual: 2, score: 0, errorPercent: 100 }],
    };

    expect(summarizeProgress([estimation, quiz, higherOrLower])).toMatchObject({
      gamesPlayed: 3,
      averageErrorPercent: 13,
    });
  });

  it("unlocks achievements only when their stated thresholds are met", () => {
    const achievements = progressAchievements(summarizeProgress([game("p1", "2026-10-20", "practice", 450)]));
    expect(achievements.find((item) => item.id === "first-game")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "high-score")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "five-games")?.unlocked).toBe(false);
    expect(achievements.find((item) => item.id === "daily-streak")?.unlocked).toBe(false);
  });
});
