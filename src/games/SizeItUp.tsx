import { useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, RotateCcw, Ruler, Trophy, ZoomIn, ZoomOut, Maximize2, ExternalLink } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { dailyChallengeId, isValidDateKey, localDateKey, saveGameResult } from "../lib/gameHistory";
import { scoreGuess } from "./sizeItUpLogic";

type Dimension = "length" | "height" | "diameter";
type Shape = "whale" | "tree" | "giraffe" | "elephant" | "earth" | "mars" | "paper" | "phone" | "airplane" | "tower" | "basketball" | "tennis";
type Puzzle = {
  id: number; reference: string; referenceShape: Shape; referenceSize: number;
  object: string; shape: Shape; actual: number; unit: string;
  referenceDimension: Dimension; dimension: Dimension; note: string; source: string;
};
type Result = { puzzle: Puzzle; guess: number; score: number; errorPercent: number };

const puzzles: Puzzle[] = [
  { id: 1, reference: "Blue whale", referenceShape: "whale", referenceSize: 33.5, referenceDimension: "length", object: "General Sherman tree", shape: "tree", actual: 83.8, unit: "m", dimension: "height", note: "Blue whale: upper body length. General Sherman: height above ground; measurements are rounded.", source: "https://sizeguess.com/animals/" },
  { id: 2, reference: "Giraffe", referenceShape: "giraffe", referenceSize: 5.49, referenceDimension: "height", object: "African elephant", shape: "elephant", actual: 3.96, unit: "m", dimension: "height", note: "Illustrative upper adult measurements; individuals vary, and elephant height is measured at the shoulder.", source: "https://sizeguess.com/animals/" },
  { id: 3, reference: "Earth", referenceShape: "earth", referenceSize: 12756, referenceDimension: "diameter", object: "Mars", shape: "mars", actual: 6792, unit: "km", dimension: "diameter", note: "Rounded equatorial diameters, so both objects use the same measurement convention.", source: "https://sizeguess.com/games/space/" },
  { id: 4, reference: "A4 paper", referenceShape: "paper", referenceSize: 29.7, referenceDimension: "length", object: "iPhone 16", shape: "phone", actual: 14.8, unit: "cm", dimension: "height", note: "A4 long side is 29.7 cm. iPhone height excludes a case.", source: "https://sizeguess.com/objects/" },
  { id: 5, reference: "Airbus A380", referenceShape: "airplane", referenceSize: 72.7, referenceDimension: "length", object: "Eiffel Tower", shape: "tower", actual: 330, unit: "m", dimension: "height", note: "The Airbus A380 overall length is 72.7 m; Eiffel Tower height depends on antennas and current convention.", source: "https://sizeguess.com/" },
];

function Silhouette({ shape, color }: { shape: Shape; color: string }) {
  const common = { fill: color, stroke: color, strokeLinejoin: "round" as const };
  switch (shape) {
    case "whale": return <svg viewBox="0 0 220 100" role="img" aria-label="Blue whale silhouette" className="sg-silhouette"><path {...common} d="M8 52 Q25 24 83 29 Q135 31 176 45 L205 31 L198 52 L210 68 L179 59 Q142 83 83 73 Q33 68 8 52Z"/><path {...common} d="M80 70 L105 88 L125 76Z"/><circle cx="39" cy="47" r="2.5" fill="#f3f1e9"/></svg>;
    case "tree": return <svg viewBox="0 0 100 200" role="img" aria-label="Giant tree silhouette" className="sg-silhouette"><path {...common} d="M44 198 L44 157 L35 140 L42 126 L29 112 L39 98 L30 84 L42 70 L35 56 L46 42 L44 27 L54 10 L64 28 L65 43 L78 55 L72 70 L83 84 L73 99 L82 113 L70 128 L76 142 L59 158 L59 198Z"/></svg>;
    case "giraffe": return <svg viewBox="0 0 100 200" role="img" aria-label="Giraffe silhouette" className="sg-silhouette"><path {...common} d="M25 198 L27 145 L18 117 L26 95 L34 84 L34 37 L41 20 L55 18 L64 31 L61 44 L55 51 L57 92 L73 115 L78 198 L65 198 L59 143 L47 143 L40 198Z"/><path {...common} d="M40 22 L32 10 L38 4 L48 12 L58 5 L65 13 L59 24Z"/></svg>;
    case "elephant": return <svg viewBox="0 0 180 120" role="img" aria-label="Elephant silhouette" className="sg-silhouette"><path {...common} d="M16 63 Q17 30 55 28 L112 28 Q145 30 150 52 L158 63 L155 96 L140 96 L135 72 L121 72 L119 103 L104 103 L101 73 L60 73 L57 103 L42 103 L40 73 L28 72 L27 97 L13 97 L15 73Z"/><path {...common} d="M142 42 Q166 45 160 72 L152 84 L146 79 L150 62 Q152 54 142 55Z"/><circle cx="130" cy="42" r="3" fill="#f3f1e9"/></svg>;
    case "earth": return <svg viewBox="0 0 100 100" role="img" aria-label="Earth silhouette" className="sg-silhouette"><circle cx="50" cy="50" r="46" {...common}/><path d="M28 17 L42 12 L51 23 L45 34 L54 42 L45 55 L33 48 L25 37 L17 37 L20 26Z M62 51 L75 45 L84 56 L77 67 L68 65 L63 78 L51 71 L53 59Z" fill="#202a4a"/></svg>;
    case "mars": return <svg viewBox="0 0 100 100" role="img" aria-label="Mars silhouette" className="sg-silhouette"><circle cx="50" cy="50" r="46" {...common}/><path d="M18 37 L34 31 L40 40 L31 49 L19 47Z M56 16 L70 24 L65 36 L52 32Z M57 57 L74 50 L83 62 L72 77 L61 71Z" fill="#7e3428"/></svg>;
    case "paper": return <svg viewBox="0 0 100 140" role="img" aria-label="A4 paper silhouette" className="sg-silhouette"><path {...common} d="M12 4 H68 L88 24 V136 H12Z"/><path d="M68 4 V24 H88" fill="none" stroke="#f3f1e9" strokeWidth="2"/></svg>;
    case "phone": return <svg viewBox="0 0 70 140" role="img" aria-label="Phone silhouette" className="sg-silhouette"><rect {...common} x="5" y="3" width="60" height="134" rx="9"/><rect x="12" y="15" width="46" height="103" rx="3" fill="#24252b"/><rect x="28" y="8" width="14" height="2" rx="1" fill="#f3f1e9"/></svg>;
    case "airplane": return <svg viewBox="0 0 220 100" role="img" aria-label="Airplane silhouette" className="sg-silhouette"><path {...common} d="M7 48 L85 43 L111 8 L128 8 L122 43 L175 45 L203 32 L213 35 L204 52 L213 65 L203 68 L175 55 L122 57 L128 92 L111 92 L85 57 L7 52Z"/></svg>;
    case "tower": return <svg viewBox="0 0 100 200" role="img" aria-label="Tower silhouette" className="sg-silhouette"><path {...common} d="M48 2 H52 L53 28 L62 39 L58 43 L75 85 L68 91 L80 198 H20 L32 91 L25 85 L42 43 L38 39 L47 28Z"/><path d="M36 103 H64 M32 137 H68 M27 170 H73" stroke="#f3f1e9" strokeWidth="3" fill="none"/></svg>;
    case "basketball": return <svg viewBox="0 0 100 100" role="img" aria-label="Basketball silhouette" className="sg-silhouette"><circle cx="50" cy="50" r="46" {...common}/><path d="M50 4 Q20 50 50 96 M50 4 Q80 50 50 96 M4 50 H96 M15 17 Q50 40 85 17 M15 83 Q50 60 85 83" fill="none" stroke="#7a3d20" strokeWidth="3"/></svg>;
    case "tennis": return <svg viewBox="0 0 100 100" role="img" aria-label="Tennis ball silhouette" className="sg-silhouette"><circle cx="50" cy="50" r="46" {...common}/><path d="M11 23 Q43 36 37 87 M89 23 Q57 36 63 87" fill="none" stroke="#e9edb4" strokeWidth="4"/></svg>;
  }
}

function dimensionLabel(dimension: Dimension) {
  return dimension === "diameter" ? "DIAMETER" : dimension.toUpperCase();
}

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
  const [guess, setGuess] = useState(puzzles[0].referenceSize);
  const [zoom, setZoom] = useState(1);
  const [targetOffset, setTargetOffset] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const resizeStart = useRef<{ x: number; guess: number } | null>(null);
  const moveStart = useRef<{ x: number; offset: number } | null>(null);
  const puzzleOffset = dailyMode ? challengeDate.split("-").reduce((sum, part) => sum + Number(part), 0) % puzzles.length : 0;
  const roundPuzzles = [...puzzles.slice(puzzleOffset), ...puzzles.slice(0, puzzleOffset)];
  const puzzle = roundPuzzles[roundIndex];
  const total = useMemo(() => results.reduce((sum, result) => sum + result.score, 0), [results]);
  const currentResult = results[roundIndex];
  const guessRange = { min: Math.max(puzzle.referenceSize * 0.1, 0.01), max: puzzle.referenceSize * 3 };
  const axisPixels = 132 * zoom;
  const guessPixels = Math.min(330, Math.max(12, axisPixels * guess / puzzle.referenceSize));
  const refAxisPixels = axisPixels;
  const shapeSize = (shape: Shape, dimension: Dimension, axis: number) => {
    const vertical = ["tree", "giraffe", "paper", "phone", "tower"].includes(shape);
    const square = ["earth", "mars", "basketball", "tennis"].includes(shape);
    if (dimension === "diameter" || square) return { width: axis, height: axis };
    return vertical ? { width: axis * 0.5, height: axis } : { width: axis, height: axis * 0.46 };
  };

  function setGuessClamped(value: number) {
    setGuess(Math.max(guessRange.min, Math.min(guessRange.max, value)));
  }
  function startResize(event: PointerEvent<HTMLButtonElement>) {
    if (revealed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeStart.current = { x: event.clientX, guess };
  }
  function moveResize(event: PointerEvent<HTMLButtonElement>) {
    if (!resizeStart.current || revealed) return;
    const delta = event.clientX - resizeStart.current.x;
    setGuessClamped(resizeStart.current.guess + delta * puzzle.referenceSize / (axisPixels * 1.6));
  }
  function endResize() { resizeStart.current = null; }
  function startMove(event: PointerEvent<HTMLDivElement>) {
    if (revealed || (event.target as HTMLElement).closest(".sg-resize-handle")) return;
    moveStart.current = { x: event.clientX, offset: targetOffset };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveTarget(event: PointerEvent<HTMLDivElement>) {
    if (!moveStart.current || revealed) return;
    setTargetOffset(Math.max(-70, Math.min(70, moveStart.current.offset + event.clientX - moveStart.current.x)));
  }
  function endMove() { moveStart.current = null; }

  function persistResult(nextResults: Result[], nextTotal: number) {
    const saved = saveGameResult({
      id: `size-it-up-${dailyMode ? challengeId : Date.now()}`,
      gameId: "size-it-up", gameTitle: "Size It Up",
      challengeId: dailyMode ? challengeId : `practice-${Date.now()}`,
      mode: dailyMode ? "daily" : "practice", playedAt: new Date().toISOString(), date: challengeDate,
      totalScore: nextTotal, maxScore: 500,
      rounds: nextResults.map(result => ({ object: result.puzzle.object, reference: result.puzzle.reference, guess: result.guess, actual: result.puzzle.actual, unit: result.puzzle.unit, score: result.score, errorPercent: result.errorPercent })),
    });
    setSaveNotice(saved.saved ? "Score saved to your local archive." : saved.reason === "already-played" ? "This daily challenge score was already saved on this device." : "Could not save locally. Check your browser storage settings.");
  }
  function startGame() {
    setStarted(true); setRoundIndex(0); setGuess(puzzles[0].referenceSize); setZoom(1); setTargetOffset(0);
    setResults([]); setRevealed(false); setFinished(false); setSaveNotice("");
  }
  function lockGuess() {
    if (revealed) return;
    const scored = scoreGuess(guess, puzzle.actual);
    const nextResults = [...results, { puzzle, guess, ...scored }];
    setResults(nextResults);
    setRevealed(true);
    if (roundIndex === puzzles.length - 1) persistResult(nextResults, nextResults.reduce((sum, result) => sum + result.score, 0));
  }
  function nextRound() {
    if (roundIndex === puzzles.length - 1) { setFinished(true); return; }
    const next = roundIndex + 1;
    setRoundIndex(next); setGuess(roundPuzzles[next].referenceSize); setZoom(1); setTargetOffset(0); setRevealed(false);
  }
  const refSize = shapeSize(puzzle.referenceShape, puzzle.referenceDimension, refAxisPixels);
  const targetSize = shapeSize(puzzle.shape, puzzle.dimension, guessPixels);
  const refColor = "#173f36";
  const targetColor = "#bd503a";

  return <main className="inner-page game-page sg-page">
    <Link className="back-link" to="/games"><ArrowLeft size={15}/> All games</Link>
    {!started ? <section className="game-intro-panel sg-intro">
      <div className="game-intro-art"><div className="intro-orbit"/><div className="intro-shape shape-tall"/><div className="intro-shape shape-small"/><div className="intro-shape shape-wide"/></div>
      <div className="game-intro-copy"><div className="eyebrow"><span className="pulse-dot"/> {dailyMode ? "DAILY CHALLENGE · 5 ROUNDS" : "REAL-WORLD SCALE · 5 ROUNDS"}</div><h1>Size It Up<span className="lime-text">.</span></h1><p>How good is your sense of scale? Compare a known real-world measurement with a mystery object. Move it, resize it, lock in your guess, and discover the actual size.</p>
        <ul><li><Check size={15}/> Five real-world comparisons</li><li><Check size={15}/> Length, height and diameter</li><li><Check size={15}/> Up to 500 points per game</li></ul>
        <button className="primary-button game-start-button" onClick={startGame}>Let’s play <ArrowRight size={16}/></button>
      </div>
    </section> : finished ? <section className="results-panel">
      <div className="results-trophy"><Trophy size={31}/></div><div className="eyebrow">{dailyMode ? "DAILY CHALLENGE COMPLETE" : "GAME COMPLETE"}</div><h1>You sized it up.</h1><div className="final-score">{total}<span> / 500</span></div><p className="results-caption">{saveNotice}</p><p className="results-caption">{total >= 440 ? "Incredible eye. You have a real feel for scale." : total >= 340 ? "Great estimating. Your instincts are getting sharp." : total >= 220 ? "Not bad! A little practice makes a big difference." : "Every guess trains your eye. Ready for another go?"}</p>
      <div className="result-list">{results.map((result,index)=><div className="result-row" key={result.puzzle.id}><span className="result-round">0{index+1}</span><span className="result-name">{result.puzzle.object}<small>{result.puzzle.dimension}: your guess {result.guess.toFixed(2)} {result.puzzle.unit} · actual {result.puzzle.actual} {result.puzzle.unit}</small></span><strong>{result.score}<small>pts</small></strong></div>)}</div>
      <button className="primary-button game-start-button" onClick={startGame}><RotateCcw size={16}/> Play again</button>
    </section> : <section className="play-panel sg-play-panel">
      <div className="sg-game-heading"><div><div className="eyebrow"><span className="pulse-dot"/> THE DAILY FIVE</div><p>{challengeDate} · PLAYVERSE SIZE GUESS</p></div><div className="sg-score"><strong>{total}</strong><span> / 500</span></div></div>
      <div className="sg-round-row"><div className="sg-round-dots" aria-label={`Round ${roundIndex + 1} of 5`}>{puzzles.map((item, index)=><span key={item.id} className={index <= roundIndex ? "is-active" : ""}/>)}</div><strong>Round {roundIndex + 1} / 5</strong></div>
      <div className="sg-progress"><span style={{ width: `${(roundIndex + 1) / puzzles.length * 100}%` }}/></div>
      <div className="sg-canvas-card">
        <div className="sg-legend"><span><i className="sg-known-dot"/> Known reference</span><span><i className="sg-guess-dot"/> Your guess</span></div>
        <div className="sg-view-controls"><button aria-label="Zoom out" onClick={() => setZoom(value => Math.max(0.65, Number((value - 0.15).toFixed(2))))}><Minus size={16}/></button><button aria-label="Zoom in" onClick={() => setZoom(value => Math.min(1.6, Number((value + 0.15).toFixed(2))))}><Plus size={16}/></button><button onClick={() => { setZoom(1); setTargetOffset(0); }}><Maximize2 size={14}/> Fit view</button></div>
        <div className="sg-stage">
          <div className="sg-object-slot sg-reference-slot">
            <div className="sg-object-wrap" style={{ width: refSize.width, height: refSize.height }}>
              <Silhouette shape={puzzle.referenceShape} color={refColor}/>
            </div>
            <div className="sg-ground-line"/>
          </div>
          <div className="sg-object-slot sg-guess-slot">
            <div className="sg-target-move" style={{ transform: `translateX(${targetOffset}px)` }} onPointerDown={startMove} onPointerMove={moveTarget} onPointerUp={endMove} onPointerCancel={endMove}>
              <div className="sg-object-wrap sg-guessed-object" style={{ width: targetSize.width, height: targetSize.height }}>
                <Silhouette shape={puzzle.shape} color={revealed ? refColor : targetColor}/>
                {!revealed && <button className="sg-resize-handle" type="button" aria-label="Pull corner to resize mystery object" onPointerDown={startResize} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} onClick={event => event.stopPropagation()}><Maximize2 size={17}/></button>}
              </div>
            </div>
            <div className="sg-ground-line"/>
          </div>
        </div>
        <div className="sg-stage-hint">{revealed ? "Actual scale revealed" : "Drag to move · Pull the corner ↗ to resize"}</div>
        <div className="sg-object-details">
          <div><span className="sg-detail-kicker">REFERENCE · {dimensionLabel(puzzle.referenceDimension)}</span><h2>{puzzle.reference}</h2><p>{puzzle.referenceSize.toLocaleString()} {puzzle.unit}</p></div>
          <div><span className="sg-detail-kicker sg-guess-kicker">{revealed ? "TRUE SIZE" : "GUESS · " + dimensionLabel(puzzle.dimension)}</span><h2>{puzzle.object}</h2><p>{revealed ? `${puzzle.actual.toLocaleString()} ${puzzle.unit}` : `Estimate its ${puzzle.dimension}`}</p></div>
        </div>
      </div>
      {!revealed ? <div className="sg-estimate-panel">
        <div className="sg-estimate-heading"><label htmlFor="sg-size-slider">Your estimate</label><output htmlFor="sg-size-slider">{guess.toLocaleString(undefined, { maximumFractionDigits: 2 })} {puzzle.unit}</output></div>
        <div className="sg-estimate-buttons"><button type="button" aria-label="Decrease estimate" onClick={() => setGuessClamped(guess - puzzle.referenceSize * 0.05)}><Minus size={16}/></button><input id="sg-size-slider" type="range" min={guessRange.min} max={guessRange.max} step={Math.max(guessRange.max / 500, 0.01)} value={guess} onChange={event => setGuessClamped(Number(event.target.value))} aria-valuetext={`${guess.toFixed(2)} ${puzzle.unit}`}/><button type="button" aria-label="Increase estimate" onClick={() => setGuessClamped(guess + puzzle.referenceSize * 0.05)}><Plus size={16}/></button></div>
        <div className="sg-estimate-ends"><span>Smaller</span><span>Larger</span></div>
        <button className="primary-button submit-guess sg-lock-button" onClick={lockGuess}>Lock in my guess <ArrowRight size={16}/></button>
      </div> : <div className="sg-reveal-panel" aria-live="polite">
        <div className="sg-reveal-score"><span>YOUR ROUND SCORE</span><strong>{currentResult?.score ?? 0}<small> / 100</small></strong></div>
        <div><h3>The actual {puzzle.dimension} is {puzzle.actual.toLocaleString()} {puzzle.unit}.</h3><p>Your estimate: {currentResult?.guess.toLocaleString(undefined, { maximumFractionDigits: 2 })} {puzzle.unit} · {currentResult?.errorPercent}% off.</p><p className="sg-source-note">{puzzle.note} <a href={puzzle.source} target="_blank" rel="noreferrer">Measurement notes <ExternalLink size={12}/></a></p></div>
        <button className="primary-button submit-guess sg-lock-button" onClick={nextRound}>{roundIndex === puzzles.length - 1 ? "See final results" : "Next comparison"} <ArrowRight size={16}/></button>
      </div>}
      <p className="game-disclaimer"><Ruler size={13}/> Drawings are schematic; the recorded measurement determines your score. Use Fit View to reset the camera, not your estimate.</p>
    </section>}
  </main>;
}
