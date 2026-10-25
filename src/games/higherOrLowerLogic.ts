export type Direction = "higher" | "lower";
export function nextDirection(current: number, next: number): Direction | "equal" {
  if (next > current) return "higher";
  if (next < current) return "lower";
  return "equal";
}
export function isCorrectGuess(current: number, next: number, guess: Direction): boolean {
  const actual = nextDirection(current, next);
  return actual !== "equal" && actual === guess;
}
export function scoreRound(current: number, next: number, guess: Direction, points = 10): number {
  return isCorrectGuess(current, next, guess) ? points : 0;
}
export function makeNumberSequence(length: number, random: () => number = Math.random): number[] {
  return Array.from({ length }, () => Math.floor(random() * 99) + 1);
}
