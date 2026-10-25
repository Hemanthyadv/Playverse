import { CalendarDays, Check, Clock3, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { dailyChallengeId, localDateKey, readGameHistory } from "../lib/gameHistory";

export default function DailyChallengePage() {
  const date = localDateKey();
  const challengeId = dailyChallengeId();
  const previous = readGameHistory().find(game => game.mode === "daily" && game.challengeId === challengeId);
  const prettyDate = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return <main className="inner-page">
    <div className="page-intro"><div className="eyebrow"><span className="pulse-dot"/> A FRESH CHALLENGE, EVERY DAY</div><h1>Your daily moment of play<span className="lime-text">.</span></h1><p>A shared five-round estimation challenge, with the same puzzle order for everyone using the same local calendar date. Your result is saved in this browser.</p></div>
    <section className="daily-challenge-card">
      <div className="daily-calendar-art"><CalendarDays size={42}/><span>DAILY</span></div>
      <div className="daily-challenge-copy"><div className="daily-date-label"><Clock3 size={14}/>{prettyDate}</div><h2>Size It Up: daily edition</h2><p>Five everyday objects. One set of puzzles for today's date. Estimate each size, reveal the answer, and earn up to 500 points.</p>
      {previous ? <div className="daily-completed"><Check size={17}/><span>Completed today <strong>{previous.totalScore} / {previous.maxScore} points</strong></span></div> : <Link className="primary-button" to="/games/size-it-up?mode=daily">Play today's challenge <Trophy size={16}/></Link>}
      <small className="daily-footnote">Challenge ID: {challengeId} · Date uses this device's local calendar.</small></div>
    </section>
    <p className="page-footnote">Daily completion is stored locally on this device, not in a shared account. Clearing browser storage or switching devices can remove or reset your history.</p>
  </main>;
}
