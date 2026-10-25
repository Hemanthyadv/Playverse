import { afterEach, describe, expect, it, vi } from "vitest";
import { clearGameHistory, dailyChallengeId, isValidDateKey, localDateKey, readGameHistory, saveGameResult, type SavedGame } from "./gameHistory";

describe("game history date identifiers", () => {
  afterEach(() => vi.useRealTimers());
  it("formats local dates consistently", () => {
    expect(localDateKey(new Date(2026, 9, 25))).toBe("2026-10-25");
    expect(dailyChallengeId(new Date(2026, 9, 25))).toBe("size-it-up-2026-10-25");
  });
});

describe("daily challenge date validation", () => {
  it("accepts real calendar dates in the supported format", () => {
    expect(isValidDateKey("2026-10-25")).toBe(true);
    expect(isValidDateKey("2024-02-29")).toBe(true);
  });

  it("rejects impossible dates and malformed values", () => {
    expect(isValidDateKey("2026-02-29")).toBe(false);
    expect(isValidDateKey("2026-13-01")).toBe(false);
    expect(isValidDateKey("2026-04-31")).toBe(false);
    expect(isValidDateKey("25-10-2026")).toBe(false);
  });
});

describe("local game history storage", () => {
  let stored: string | null = null;

  afterEach(() => {
    vi.unstubAllGlobals();
    stored = null;
  });

  function installStorage() {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => stored),
      setItem: vi.fn((_key: string, value: string) => { stored = value; }),
      removeItem: vi.fn(() => { stored = null; }),
    });
  }

  const sample: SavedGame = {
    id: "size-it-up-practice-1",
    challengeId: "practice-1",
    mode: "practice",
    playedAt: "2026-10-25T00:00:00.000Z",
    date: "2026-10-25",
    totalScore: 75,
    maxScore: 500,
    rounds: [{ object: "Water bottle", guess: 20, actual: 24, score: 75, errorPercent: 17 }],
  };

  it("saves and reads a valid result", () => {
    installStorage();
    expect(saveGameResult(sample)).toEqual({ saved: true });
    expect(readGameHistory()).toEqual([sample]);
  });

  it("prevents saving the same daily challenge twice", () => {
    installStorage();
    const daily = { ...sample, id: "daily-1", challengeId: "size-it-up-2026-10-25", mode: "daily" as const };
    expect(saveGameResult(daily)).toEqual({ saved: true });
    expect(saveGameResult({ ...daily, id: "daily-2" })).toEqual({ saved: false, reason: "already-played" });
    expect(readGameHistory()).toHaveLength(1);
  });

  it("ignores malformed stored entries and can clear history", () => {
    installStorage();
    stored = JSON.stringify([{ id: "bad", mode: "daily", rounds: [{ object: 42 }] }]);
    expect(readGameHistory()).toEqual([]);
    expect(clearGameHistory()).toBe(true);
    expect(stored).toBeNull();
  });
});
