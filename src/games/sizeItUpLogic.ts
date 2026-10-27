export type EstimateScore = { score: number; errorPercent: number };

/**
 * Scores by proportional (multiplicative) error so half and double are treated
 * equally across tiny and enormous objects. A factor of 1.03 earns full points;
 * a factor of four or more earns zero.
 */
export function scoreGuess(guess: number, actual: number): EstimateScore {
  if (!Number.isFinite(guess) || !Number.isFinite(actual) || actual <= 0 || guess <= 0) {
    throw new RangeError("Guess and actual measurement must be positive finite numbers.");
  }

  const errorPercent = Math.round((Math.abs(guess - actual) / actual) * 100);
  const factor = Math.max(guess / actual, actual / guess);
  let score = 0;
  if (factor <= 1.03) score = 100;
  else if (factor < 4) score = Math.max(0, Math.min(99, Math.round(100 * (1 - Math.log(factor) / Math.log(4)))));

  return { score, errorPercent };
}
