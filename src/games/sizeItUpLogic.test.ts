import { describe, expect, it } from "vitest";
import { scoreGuess } from "./sizeItUpLogic";

describe("Size It Up scoring", () => {
  it("awards 100 points for an exact estimate", () => {
    expect(scoreGuess(24, 24)).toEqual({ score: 100, errorPercent: 0 });
  });

  it("reduces points in proportion to the relative error", () => {
    expect(scoreGuess(20, 24)).toEqual({ score: 75, errorPercent: 17 });
  });

  it("never awards a negative score for a very inaccurate estimate", () => {
    expect(scoreGuess(50, 5)).toEqual({ score: 0, errorPercent: 900 });
  });

  it("rejects invalid measurements instead of producing NaN scores", () => {
    expect(() => scoreGuess(10, 0)).toThrow(RangeError);
    expect(() => scoreGuess(Number.NaN, 10)).toThrow(RangeError);
    expect(() => scoreGuess(-1, 10)).toThrow(RangeError);
  });
});
