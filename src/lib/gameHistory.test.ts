import { afterEach, describe, expect, it, vi } from "vitest";
import { dailyChallengeId, isValidDateKey, localDateKey } from "./gameHistory";

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
