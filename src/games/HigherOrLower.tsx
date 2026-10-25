import { useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { makeNumberSequence, scoreRound, type Direction } from "./higherOrLowerLogic";

const ROUNDS = 10;
export default function HigherOrLower() {
  const [numbers, setNumbers] = useState<number[]>(() => makeNumberSequence(ROUNDS + 1));
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const score = useMemo(() => answers.reduce((total, correct) => total + (correct ? 10 : 0), 0), [answers]);
  function choose(direction: Direction) {
    if (answers.length > round || finished) return;
    const correct = scoreRound(numbers[round], numbers[round + 1], direction) > 0;
    const nextAnswers = [...answers, correct];
    setAnswers(nextAnswers);
    if (round === ROUNDS - 1) setFinished(true);
    else setRound(value => value + 1);
  }
  function restart() {
    setNumbers(makeNumberSequence(ROUNDS + 1));
    setRound(0); setAnswers([]); setFinished(false);
  }
  return <main className="inner-page higher-lower-page">
    <Link className="back-link" to="/games"><ArrowLeft size={15}/> All games</Link>
    {!finished ? <section className="hl-panel">
      <div className="eyebrow"><span className="pulse-dot"/> NUMBER SENSE · {ROUNDS} ROUNDS</div>
      <h1>Higher or Lower<span className="lime-text">?</span></h1>
      <p className="hl-intro">Trust your instincts. Will the next number be higher or lower? Equal numbers count as a miss.</p>
      <div className="hl-status"><span>ROUND <strong>{round + 1}</strong> / {ROUNDS}</span><span>SCORE <strong>{score}</strong> / 100</span></div>
      <div className="hl-progress" aria-label={`Round ${round + 1} of ${ROUNDS}`}><span style={{width:`${(round / ROUNDS) * 100}%`}}/></div>
      <div className="number-duel"><div><span>CURRENT NUMBER</span><strong>{numbers[round]}</strong></div><div className="hl-question">?</div></div>
      <p className="hl-prompt">What do you think comes next?</p>
      <div className="hl-choices"><button onClick={() => choose("higher")}><ArrowUp size={21}/> Higher</button><button onClick={() => choose("lower")}><ArrowDown size={21}/> Lower</button></div>
      <p className="hl-note">Correct answer = 10 points. No penalty beyond missing that round.</p>
    </section> : <section className="hl-panel hl-results">
      <div className="results-trophy"><Trophy size={30}/></div><div className="eyebrow">GAME COMPLETE</div><h1>{score >= 80 ? "Sharp instincts." : score >= 50 ? "Nice run." : "Keep practicing."}</h1>
      <div className="final-score">{score}<span> / 100</span></div><p className="results-caption">You got {answers.filter(Boolean).length} of {ROUNDS} predictions right.</p>
      <div className="hl-answer-grid">{answers.map((correct, index) => <span key={index} className={correct ? "hl-answer-correct" : "hl-answer-miss"} title={`Round ${index + 1}: ${correct ? "correct" : "miss"}`}>{index + 1}</span>)}</div>
      <button className="primary-button game-start-button" onClick={restart}><RotateCcw size={16}/> Play again <ArrowRight size={16}/></button>
    </section>}
  </main>;
}
