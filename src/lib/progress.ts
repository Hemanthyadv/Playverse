import type { SavedGame } from "./gameHistory";

export type ProgressSummary = {
  gamesPlayed: number;
  totalPoints: number;
  bestScore: number;
  averageScore: number;
  averageErrorPercent: number | null;
  dailyChallengesCompleted: number;
  longestDailyStreak: number;
  perfectRounds: number;
};

export function summarizeProgress(history: SavedGame[]): ProgressSummary {
  const gamesPlayed = history.length;
  const totalPoints = history.reduce((sum, game) => sum + game.totalScore, 0);
  const totalRounds = history.reduce((sum, game) => sum + game.rounds.length, 0);
  const totalError = history.reduce(
    (sum, game) => sum + game.rounds.reduce((roundSum, round) => roundSum + round.errorPercent, 0),
    0,
  );
  const dailyDates = [...new Set(
    history.filter((game) => game.mode === "daily").map((game) => game.date),
  )].sort();
  let currentStreak = 0;
  let longestDailyStreak = 0;
  let previousDay: Date | null = null;

  for (const date of dailyDates) {
    const [year, month, day] = date.split("-").map(Number);
    const currentDay = new Date(Date.UTC(year, month - 1, day));
    const difference = previousDay
      ? (currentDay.getTime() - previousDay.getTime()) / 86_400_000
      : 0;
    currentStreak = previousDay && difference === 1 ? currentStreak + 1 : 1;
    longestDailyStreak = Math.max(longestDailyStreak, currentStreak);
    previousDay = currentDay;
  }

  return {
    gamesPlayed,
    totalPoints,
    bestScore: history.reduce((best, game) => Math.max(best, game.totalScore), 0),
    averageScore: gamesPlayed ? Math.round(totalPoints / gamesPlayed) : 0,
    averageErrorPercent: totalRounds ? Math.round(totalError / totalRounds) : null,
    dailyChallengesCompleted: dailyDates.length,
    longestDailyStreak,
    perfectRounds: history.reduce(
      (sum, game) => sum + game.rounds.filter((round) => round.score >= 100).length,
      0,
    ),
  };
}

export function progressAchievements(summary: ProgressSummary) {
  return [
    { id: "first-game", title: "First steps", description: "Complete your first game.", unlocked: summary.gamesPlayed >= 1 },
    { id: "five-games", title: "Regular player", description: "Complete five games.", unlocked: summary.gamesPlayed >= 5 },
    { id: "high-score", title: "Sharp eye", description: "Score at least 400 points in one game.", unlocked: summary.bestScore >= 400 },
    { id: "perfect-round", title: "Spot on", description: "Earn 100 points in a round.", unlocked: summary.perfectRounds >= 1 },
    { id: "daily-streak", title: "Daily habit", description: "Complete challenges on three consecutive dates.", unlocked: summary.longestDailyStreak >= 3 },
  ];
}
