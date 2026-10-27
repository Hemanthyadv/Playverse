import { describe, expect, it } from "vitest";
import { scoreGuess } from "./sizeItUpLogic";

describe("Size It Up scoring", () => {
  it("awards 100 points for an exact estimate", () => {
    expect(scoreGuess(24, 24)).toEqual({ score: 100, errorPercent: 0 });
  });

  it("awards full points inside the three-percent tolerance", () => {
    expect(scoreGuess(24.6, 24)).toEqual({ score: 100, errorPercent: 3 });
  });

  it("treats half and double as the same proportional error", () => {
    expect(scoreGuess(12, 24).score).toBe(50);
    expect(scoreGuess(48, 24).score).toBe(50);
  });

  it("uses a logarithmic penalty for proportional errors", () => {
    expect(scoreGuess(36, 24).score).toBe(71);
  });

  it("awards zero points when the guess is four times or more away", () => {
    expect(scoreGuess(96, 24).score).toBe(0);
    expect(scoreGuess(6, 24).score).toBe(0);
  });

  it("rejects invalid measurements instead of producing NaN scores", () => {
    expect(() => scoreGuess(10, 0)).toThrow(RangeError);
    expect(() => scoreGuess(Number.NaN, 10)).toThrow(RangeError);
    expect(() => scoreGuess(-1, 10)).toThrow(RangeError);
  });
});
