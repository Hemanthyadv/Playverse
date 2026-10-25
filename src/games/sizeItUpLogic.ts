export type EstimateScore = { score: number; errorPercent: number };

/** Scores an estimate against the actual measurement, capped to the 0–100 range. */
export function scoreGuess(guess: number, actual: number): EstimateScore {
  if (!Number.isFinite(guess) || !Number.isFinite(actual) || actual <= 0 || guess < 0) {
    throw new RangeError("Guess must be non-negative and actual measurement must be positive.");
  }

  const errorPercent = (Math.abs(guess - actual) / actual) * 100;
  return {
    score: Math.max(0, Math.min(100, Math.round(100 - errorPercent * 1.5))),
    errorPercent: Math.round(errorPercent),
  };
}
