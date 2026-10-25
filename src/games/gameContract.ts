export type GameMode = "daily" | "practice";
export type GameRoundResult = { round: number; score: number; correct: boolean };
export type GameDefinition = {
  id: string;
  title: string;
  category: string;
  description: string;
  route: string;
  maxScore: number;
};
export const gameCatalog: GameDefinition[] = [
  { id: "size-it-up", title: "Size It Up", category: "Estimation", description: "Estimate everyday object sizes.", route: "/games/size-it-up", maxScore: 500 },
  { id: "higher-or-lower", title: "Higher or Lower", category: "Number sense", description: "Predict whether the next number goes up or down.", route: "/games/higher-or-lower", maxScore: 100 },
  { id: "daily-quiz", title: "Daily Quiz", category: "Trivia", description: "Answer five quick multiple-choice questions.", route: "/games/daily-quiz", maxScore: 100 },
];
