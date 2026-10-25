export type SavedRound = { object: string; guess: number; actual: number; score: number; errorPercent: number };
export type SavedGame = {
  id: string;
  challengeId: string;
  mode: "daily" | "practice";
  playedAt: string;
  date: string;
  totalScore: number;
  maxScore: number;
  rounds: SavedRound[];
};
const STORAGE_KEY = "playverse.game-history.v1";

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function dailyChallengeId(date = new Date()): string {
  return `size-it-up-${localDateKey(date)}`;
}
export function readGameHistory(): SavedGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedGame =>
      !!item && typeof item.id === "string" && typeof item.challengeId === "string" &&
      (item.mode === "daily" || item.mode === "practice") && typeof item.playedAt === "string" &&
      typeof item.date === "string" && typeof item.totalScore === "number" && Array.isArray(item.rounds)
    );
  } catch {
    return [];
  }
}
export function saveGameResult(result: SavedGame): { saved: boolean; reason?: "already-played" | "storage-unavailable" } {
  try {
    const history = readGameHistory();
    if (result.mode === "daily" && history.some(item => item.mode === "daily" && item.challengeId === result.challengeId)) {
      return { saved: false, reason: "already-played" };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([result, ...history].slice(0, 500)));
    return { saved: true };
  } catch {
    return { saved: false, reason: "storage-unavailable" };
  }
}
export function clearGameHistory(): boolean {
  try { localStorage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
