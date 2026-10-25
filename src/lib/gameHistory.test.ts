import { afterEach, describe, expect, it, vi } from "vitest";
import { dailyChallengeId, localDateKey } from "./gameHistory";

describe("game history date identifiers", () => {
  afterEach(() => vi.useRealTimers());
  it("formats local dates consistently", () => {
    expect(localDateKey(new Date(2026, 9, 25))).toBe("2026-10-25");
    expect(dailyChallengeId(new Date(2026, 9, 25))).toBe("size-it-up-2026-10-25");
  });
});
