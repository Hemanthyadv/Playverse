import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Ruler, Trophy } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { dailyChallengeId, isValidDateKey, localDateKey, saveGameResult } from "../lib/gameHistory";
import { scoreGuess } from "./sizeItUpLogic";

type Puzzle = { id: number; object: string; clue: string; actual: number; unit: string; reference: string; referenceSize: number; shape: "bottle" | "book" | "ball" | "mug" | "plant" };
type Result = { puzzle: Puzzle; guess: number; score: number; errorPercent: number };

const puzzles: Puzzle[] = [
  { id: 1, object: "Water bottle", clue: "A reusable bottle you might carry every day.", actual: 24, unit: "cm", reference: "A standard pencil", referenceSize: 19, shape: "bottle" },
  { id: 2, object: "Paperback book", clue: "A pocket-sized paperback, closed and standing upright.", actual: 19, unit: "cm", reference: "A standard pencil", referenceSize: 19, shape: "book" },
  { id: 3, object: "Basketball", clue: "A regulation-size basketball, measured across its widest point.", actual: 24, unit: "cm", reference: "A standard pencil", referenceSize: 19, shape: "ball" },
  { id: 4, object: "Coffee mug", clue: "A regular ceramic mug, measured from side to side.", actual: 9, unit: "cm", reference: "A standard pencil", referenceSize: 19, shape: "mug" },
  { id: 5, object: "Small houseplant", clue: "A compact potted plant, from the pot base to its tallest leaf.", actual: 32, unit: "cm", reference: "A standard pencil", referenceSize: 19, shape: "plant" },
];


export default function SizeItUp() {
  const [searchParams] = useSearchParams();
  const dailyMode = searchParams.get("mode") === "daily";
  const today = localDateKey();
  const requestedDate = searchParams.get("date") ?? "";
  const challengeDate = dailyMode && isValidDateKey(requestedDate) ? requestedDate : today;
  const challengeId = dailyChallengeId(new Date(challengeDate + "T12:00:00"));
  const [saveNotice, setSaveNotice] = useState("");
  const [started, setStarted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(20);
  const dragStart = useRef<{ x: number; guess: number } | null>(null);
  function startResize(event: React.PointerEvent<HTMLDivElement>) {
    if (revealed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, guess };
  }
  function moveResize(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current || revealed) return;
    const delta = event.clientX - dragStart.current.x;
    setGuess(Math.max(5, Math.min(50, Math.round(dragStart.current.guess + delta / 5))));
  }
  function endResize() { dragStart.current = null; }
  const [results, setResults] = useState<Result[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const dailyOffset = challengeDate.split("-").reduce((sum, part) => sum + Number(part), 0) % puzzles.length;
  const roundPuzzles = dailyMode ? [...puzzles.slice(dailyOffset), ...puzzles.slice(0, dailyOffset)] : puzzles;
  const puzzle = roundPuzzles[roundIndex];
  const total = useMemo(() => results.reduce((sum, result) => sum + result.score, 0), [results]);
  const currentResult = results[roundIndex];
  function persistResult() {
    const saved = saveGameResult({
      id: `size-it-up-${dailyMode ? challengeId : Date.now()}`,
      gameId: "size-it-up",
      gameTitle: "Size It Up",
      challengeId: dailyMode ? challengeId : `practice-${Date.now()}`,
      mode: dailyMode ? "daily" : "practice",
      playedAt: new Date().toISOString(),
      date: challengeDate,
      totalScore: total,
      maxScore: 500,
      rounds: results.map(result => ({ object: result.puzzle.object, guess: result.guess, actual: result.puzzle.actual, score: result.score, errorPercent: result.errorPercent })),
    });
    setSaveNotice(saved.saved ? "Score saved to your local archive." : saved.reason === "already-played" ? "This daily challenge score was already saved on this device." : "Could not save locally. Check your browser storage settings.");
  }

  function startGame() {
    setStarted(true); setRoundIndex(0); setGuess(20); setResults([]); setRevealed(false); setFinished(false); setSaveNotice("");
  }
  function lockGuess() {
    if (revealed) return;
    const scored = scoreGuess(guess, puzzle.actual);
    setResults(previous => [...previous, { puzzle, guess, ...scored }]);
    setRevealed(true);
  }
  function nextRound() {
    if (roundIndex === puzzles.length - 1) { setFinished(true); persistResult(); return; }
    setRoundIndex(index => index + 1);
    setGuess(20);
    setRevealed(false);
  }

  return <main className="inner-page game-page">
    <Link className="back-link" to="/games"><ArrowLeft size={15}/> All games</Link>
    {!started ? <section className="game-intro-panel">
      <div className="game-intro-art"><div className="intro-orbit"/><div className="intro-shape shape-tall"/><div className="intro-shape shape-small"/><div className="intro-shape shape-wide"/></div>
      <div className="game-intro-copy"><div className="eyebrow"><span className="pulse-dot"/> {dailyMode ? "DAILY CHALLENGE · 5 ROUNDS" : "ESTIMATION · 5 ROUNDS"}</div><h1>Size It Up<span className="lime-text">.</span></h1><p>How good is your eye? Resize the mystery object to match your best estimate. Then reveal the real measurement and see how close you got.</p>
        <ul><li><Check size={15}/> Five objects per game</li><li><Check size={15}/> Up to 100 points per round</li><li><Check size={15}/> No timer — trust your instincts</li></ul>
        <button className="primary-button game-start-button" onClick={startGame}>Start playing <ArrowRight size={16}/></button>
      </div>
    </section> : finished ? <section className="results-panel">
      <div className="results-trophy"><Trophy size={31}/></div><div className="eyebrow">{dailyMode ? "DAILY CHALLENGE COMPLETE" : "GAME COMPLETE"}</div><h1>You sized it up.</h1><div className="final-score">{total}<span> / 500</span></div><p className="results-caption">{saveNotice}</p><p className="results-caption">{total >= 440 ? "Incredible eye. You have a real feel for scale." : total >= 340 ? "Great estimating. Your instincts are getting sharp." : total >= 220 ? "Not bad! A little practice makes a big difference." : "Every guess trains your eye. Ready for another go?"}</p>
      <div className="result-list">{results.map((result,index)=><div className="result-row" key={result.puzzle.id}><span className="result-round">0{index+1}</span><span className="result-name">{result.puzzle.object}<small>Your guess: {result.guess} {result.puzzle.unit} · Actual: {result.puzzle.actual} {result.puzzle.unit}</small></span><strong>{result.score}<small>pts</small></strong></div>)}</div>
      <button className="primary-button game-start-button" onClick={startGame}><RotateCcw size={16}/> Play again</button>
    </section> : <section className="play-panel">
      <div className="play-topline"><div><div className="eyebrow">SIZE IT UP · REGULAR</div><h1>Trust your eye<span className="lime-text">.</span></h1></div><div className="round-count">ROUND <strong>{roundIndex+1}</strong><span>/ {puzzles.length}</span></div></div>
      <div className="round-progress" aria-label={`Round ${roundIndex+1} of ${puzzles.length}`}><span style={{width:`${(roundIndex+1)/puzzles.length*100}%`}}/></div>
      <div className="score-strip"><span>YOUR SCORE</span><strong>{total}<small> / 500</small></strong></div>
      <div className="scale-match-panel">
        <div className="scale-match-heading"><div><span className="object-tag">MYSTERY OBJECT</span><h2>{puzzle.object}</h2><p>{puzzle.clue}</p></div><div className="scale-readout">{guess}<small> {puzzle.unit}</small></div></div>
        <div className="scale-match-stage" aria-label={`Resize ${puzzle.object} to match the target outline`}>
          <div className={`scale-match-object ${puzzle.shape}`} style={{ width: `${guess * 1.8}%` }}>
            <span className="scale-object-highlight" />
            {!revealed && <div className="scale-drag-handle" role="slider" tabIndex={0} aria-label="Drag to resize object" aria-valuemin={5} aria-valuemax={50} aria-valuenow={guess} onPointerDown={startResize} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} onKeyDown={event => { if (event.key === "ArrowRight") setGuess(value => Math.min(50, value + 1)); if (event.key === "ArrowLeft") setGuess(value => Math.max(5, value - 1)); }}><span /></div>}
          </div>
          <div className="scale-target-wrap"><span className="scale-target-label">MATCH THIS LENGTH</span><div className="scale-target" style={{ width: `${puzzle.actual * 1.8}%` }}><span className="target-tick start" /><span className="target-tick end" /></div></div>
          <div className="scale-axis"><span>0 cm</span><span>50 cm</span></div>
        </div>
        <div className="scale-instructions"><span className="scale-instruction-icon">↔</span><span>Drag the object's right edge, or use the slider below, to match the target.</span></div>
      </div>
      {!revealed ? <div className="guess-controls"><div className="guess-label-row"><label htmlFor="size-guess">Fine-tune the length</label><output htmlFor="size-guess">{guess} <span>{puzzle.unit}</span></output></div><input id="size-guess" className="size-slider" type="range" min="5" max="50" step="1" value={guess} onChange={event=>setGuess(Number(event.target.value))} style={{background: `linear-gradient(90deg, var(--lime) 0%, var(--lime) ${(guess-5)/45*100}%, #36373e ${(guess-5)/45*100}%, #36373e 100%)`}} aria-valuetext={`${guess} centimetres`}/><div className="slider-labels"><span>5 cm</span><span>50 cm</span></div><button className="primary-button submit-guess" onClick={lockGuess}>Lock in estimate <ArrowRight size={16}/></button></div> : <div className="reveal-panel" aria-live="polite"><div className="reveal-score"><span>YOUR ROUND SCORE</span><strong>{currentResult?.score ?? 0}<small> / 100</small></strong></div><div className="reveal-copy"><h3>The actual size is {puzzle.actual} {puzzle.unit}.</h3><p>You guessed {currentResult?.guess} {puzzle.unit}, which is about {currentResult?.errorPercent}% off.</p></div><button className="primary-button submit-guess" onClick={nextRound}>{roundIndex===puzzles.length-1 ? "See final results" : "Next object"} <ArrowRight size={16}/></button></div>}
      <p className="game-disclaimer"><Ruler size={13}/> Practice game: object measurements are illustrative estimates, not a precision reference.</p>
    </section>}
  </main>;
}
