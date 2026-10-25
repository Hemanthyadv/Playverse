import { Award, Flame, Gamepad2, Gauge, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { readGameHistory } from "../lib/gameHistory";
import { progressAchievements, summarizeProgress } from "../lib/progress";

const metrics = [
  { key: "gamesPlayed", label: "GAMES PLAYED", icon: Gamepad2 },
  { key: "bestScore", label: "BEST SCORE", icon: Trophy },
  { key: "averageScore", label: "AVERAGE SCORE", icon: Gauge },
  { key: "averageErrorPercent", label: "AVERAGE ESTIMATE ERROR", icon: Target },
] as const;

export default function ProgressPage() {
  const history = readGameHistory();
  const summary = summarizeProgress(history);
  const achievements = progressAchievements(summary);

  return (
    <main className="inner-page progress-page">
      <div className="page-intro">
        <div className="eyebrow"><span className="pulse-dot" /> YOUR PERSONAL SCOREBOARD</div>
        <h1>Little wins add up<span className="lime-text">.</span></h1>
        <p>Your progress is calculated from games saved in this browser. Nothing is uploaded to an account, and clearing browser storage clears these stats.</p>
      </div>

      {history.length ? (
        <>
          <section className="progress-metrics" aria-label="Your game statistics">
            {metrics.map(({ key, label, icon: Icon }) => (
              <article className="progress-metric" key={key}>
                <span className="progress-metric-icon"><Icon size={18} /></span>
                <span className="progress-metric-label">{label}</span>
                <strong>{key === "averageErrorPercent"
                  ? summary.averageErrorPercent === null ? "—" : `${summary.averageErrorPercent}%`
                  : summary[key].toLocaleString()}</strong>
              </article>
            ))}
          </section>

          <section className="progress-secondary" aria-label="Additional progress">
            <article><Flame size={19} /><span>Longest daily streak</span><strong>{summary.longestDailyStreak} {summary.longestDailyStreak === 1 ? "day" : "days"}</strong></article>
            <article><Trophy size={19} /><span>Daily challenges completed</span><strong>{summary.dailyChallengesCompleted}</strong></article>
            <article><Target size={19} /><span>Perfect rounds</span><strong>{summary.perfectRounds}</strong></article>
          </section>

          <section className="achievement-section">
            <div className="section-heading">
              <div><div className="eyebrow">MILESTONES</div><h2>Achievements<span className="lime-text">.</span></h2></div>
              <span className="achievement-count">{achievements.filter((item) => item.unlocked).length} / {achievements.length} unlocked</span>
            </div>
            <div className="achievement-grid">
              {achievements.map((item) => (
                <article className={item.unlocked ? "achievement-card achievement-unlocked" : "achievement-card"} key={item.id}>
                  <span className="achievement-icon"><Award size={20} /></span>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                  <span className="achievement-status">{item.unlocked ? "UNLOCKED" : "LOCKED"}</span>
                </article>
              ))}
            </div>
          </section>
          <Link className="text-link progress-archive-link" to="/archive">Review your saved games <span aria-hidden="true">→</span></Link>
        </>
      ) : (
        <section className="progress-empty">
          <span className="progress-empty-icon"><Trophy size={28} /></span>
          <h2>Your first win is waiting.</h2>
          <p>Finish a Size It Up round to start building your personal stats and unlock achievements. Your results stay on this device.</p>
          <Link className="primary-button" to="/games/size-it-up">Play Size It Up <Gamepad2 size={16} /></Link>
        </section>
      )}
    </main>
  );
}
