import { describe, expect, it } from "vitest";
import { isCorrectGuess, makeNumberSequence, nextDirection, scoreRound } from "./higherOrLowerLogic";

describe("higher or lower rules", () => {
  it("identifies direction and ties", () => {
    expect(nextDirection(10, 11)).toBe("higher");
    expect(nextDirection(11, 10)).toBe("lower");
    expect(nextDirection(10, 10)).toBe("equal");
  });
  it("scores correct predictions only", () => {
    expect(scoreRound(4, 8, "higher")).toBe(10);
    expect(scoreRound(8, 4, "higher")).toBe(0);
    expect(isCorrectGuess(5, 5, "lower")).toBe(false);
  });
  it("uses the supplied random source and stays within 1..99", () => {
    expect(makeNumberSequence(3, () => 0)).toEqual([1, 1, 1]);
    expect(makeNumberSequence(2, () => 0.999)).toEqual([99, 99]);
  });
});
