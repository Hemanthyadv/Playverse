import { useMemo, useState } from "react";
import { Archive, CalendarDays, RotateCcw, Search, Trash2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { clearGameHistory, readGameHistory, type SavedGame } from "../lib/gameHistory";

function formatDate(date: string) {
  const parsed = new Date(date + "T12:00:00");
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ArchivePage() {
  const [history, setHistory] = useState<SavedGame[]>(() => readGameHistory());
  const [filter, setFilter] = useState<"all" | "daily" | "practice">("all");
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      history.filter(
        (item) =>
          (filter === "all" || item.mode === filter) &&
          ((item.gameTitle ?? "Size It Up").toLowerCase().includes(normalizedQuery) ||
            item.date.includes(normalizedQuery) ||
            item.rounds.some((round) => round.object.toLowerCase().includes(normalizedQuery))),
      ),
    [history, filter, normalizedQuery],
  );

  function clearHistory() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    if (clearGameHistory()) setHistory([]);
    setConfirmClear(false);
  }

  return (
    <main className="inner-page">
      <div className="page-intro">
        <div className="eyebrow"><span className="pulse-dot" /> THE REPLAY SHELF</div>
        <h1>Your games, all in one place<span className="lime-text">.</span></h1>
        <p>Review saved scores from daily challenges and practice rounds played in this browser. Pick a past challenge to play the game again.</p>
      </div>
      <div className="archive-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dates or objects..." aria-label="Search saved games" />
        </label>
        <div className="archive-filters" aria-label="Filter saved games">
          <button className={filter === "all" ? "filter-active" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "daily" ? "filter-active" : ""} onClick={() => setFilter("daily")}>Daily</button>
          <button className={filter === "practice" ? "filter-active" : ""} onClick={() => setFilter("practice")}>Practice</button>
        </div>
      </div>
      {visible.length ? (
        <>
          <div className="archive-results-heading">
            <span>{visible.length} {visible.length === 1 ? "GAME" : "GAMES"} FOUND</span>
            <button className="clear-history" onClick={clearHistory}><Trash2 size={14} />{confirmClear ? "Confirm clear history" : "Clear history"}</button>
          </div>
          <div className="archive-list">
            {visible.map((item) => (
              <article className="archive-entry" key={item.id}>
                <div className="archive-entry-icon">{item.mode === "daily" ? <CalendarDays size={20} /> : <Archive size={20} />}</div>
                <div className="archive-entry-main">
                  <span className="archive-entry-meta">{item.mode === "daily" ? "DAILY CHALLENGE" : "PRACTICE"} · {formatDate(item.date)}</span>
                  <h2>{item.gameTitle ?? "Size It Up"}</h2>
                  <p>{item.rounds.map((round) => round.object).join(" · ")}</p>
                  <div className="archive-round-scores">
                    {item.rounds.map((round, index) => <span key={index}>R{index + 1}: {round.score}</span>)}
                  </div>
                </div>
                <div className="archive-entry-score"><Trophy size={15} /><strong>{item.totalScore}</strong><span>/ {item.maxScore}</span></div>
                <Link
                  className="archive-replay"
                  to={item.gameId === "higher-or-lower" ? "/games/higher-or-lower" : item.mode === "daily" ? `/games/size-it-up?mode=daily&date=${item.date}` : "/games/size-it-up"}
                  aria-label={`Replay ${item.mode} ${item.gameTitle ?? "Size It Up"} from ${item.date}`}
                ><RotateCcw size={15} /> Replay</Link>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state archive-empty">
          <div className="archive-icon"><Archive size={27} /></div>
          <h2>{history.length ? "No matching games" : "Your archive starts here."}</h2>
          <p>{history.length ? "Try a different search or filter." : "Play Size It Up to save your first score. Your completed games will appear here."}</p>
          <Link className="primary-button" to="/games/size-it-up">Play Size It Up</Link>
        </div>
      )}
      <p className="page-footnote">History is kept in local browser storage on this device. It is not synced between devices or backed up to an account.</p>
    </main>
  );
}
