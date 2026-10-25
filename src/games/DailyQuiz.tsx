import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { localDateKey, saveGameResult } from "../lib/gameHistory";

const questions = [
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: "Mars", fact: "Iron-rich dust gives Mars its reddish appearance." },
  { question: "How many sides does a hexagon have?", options: ["Five", "Six", "Seven", "Eight"], answer: "Six", fact: "The prefix “hex” means six." },
  { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific", fact: "The Pacific covers more area than all Earth's land combined." },
  { question: "What do bees collect from flowers to make honey?", options: ["Nectar", "Dew", "Sap", "Pollen only"], answer: "Nectar", fact: "Bees turn nectar into honey through enzymes and evaporation." },
  { question: "Which instrument measures temperature?", options: ["Barometer", "Thermometer", "Compass", "Altimeter"], answer: "Thermometer", fact: "Thermometers measure temperature using materials that respond to heat." },
];

export default function DailyQuiz() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");
  const score = answers.filter(Boolean).length * 20;
  const current = questions[index];

  function startAgain() {
    setStarted(true);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setSavedNotice("");
  }

  function submitAnswer() {
    if (!selected || finished) return;
    const correct = selected === current.answer;
    const nextAnswers = [...answers, correct];
    setAnswers(nextAnswers);
    if (index === questions.length - 1) {
      setFinished(true);
      const result = saveGameResult({
        id: `daily-quiz-${Date.now()}`,
        gameId: "daily-quiz",
        gameTitle: "Daily Quiz",
        challengeId: `daily-quiz-practice-${Date.now()}`,
        mode: "practice",
        playedAt: new Date().toISOString(),
        date: localDateKey(),
        totalScore: nextAnswers.filter(Boolean).length * 20,
        maxScore: 100,
        rounds: nextAnswers.map((wasCorrect, roundIndex) => ({
          object: questions[roundIndex].question,
          guess: wasCorrect ? questions[roundIndex].answer : "Incorrect answer",
          actual: questions[roundIndex].answer,
          score: wasCorrect ? 20 : 0,
          errorPercent: wasCorrect ? 0 : 100,
        })),
      });
      setSavedNotice(result.saved ? "Your quiz score was saved to your local archive." : "Your quiz finished, but this browser could not save the score.");
    } else {
      setIndex(value => value + 1);
      setSelected(null);
    }
  }

  return (
    <main className="inner-page quiz-page">
      <Link className="back-link" to="/games"><ArrowLeft size={15}/> All games</Link>
      {!started ? (
        <section className="quiz-panel quiz-intro">
          <div className="quiz-orbit" aria-hidden="true"><Sparkles size={50}/><span>?</span></div>
          <div className="eyebrow"><span className="pulse-dot"/> TRIVIA · 5 QUESTIONS</div>
          <h1>Daily Quiz<span className="lime-text">.</span></h1>
          <p>Five quick questions across science, nature and everyday knowledge. Pick an answer, learn a tiny fact, and see how much you know.</p>
          <ul className="quiz-benefits"><li><CheckCircle2 size={16}/> Five multiple-choice questions</li><li><CheckCircle2 size={16}/> Instant feedback and fun facts</li><li><CheckCircle2 size={16}/> Up to 100 points per quiz</li></ul>
          <button className="primary-button quiz-action" onClick={startAgain}>Start the quiz <ArrowRight size={16}/></button>
        </section>
      ) : finished ? (
        <section className="quiz-panel quiz-results">
          <span className="quiz-trophy"><Trophy size={30}/></span>
          <div className="eyebrow"><span className="pulse-dot"/> QUIZ COMPLETE</div>
          <h1>{score >= 80 ? "Brilliant brain." : score >= 40 ? "Nice curiosity." : "Keep exploring."}</h1>
          <div className="quiz-final-score">{score}<span> / 100</span></div>
          <p>{answers.filter(Boolean).length} out of {questions.length} correct. Every question is a chance to learn something new.</p>
          <p className="quiz-save-note" role="status">{savedNotice}</p>
          <div className="quiz-answer-summary">{questions.map((q, i) => <div key={q.question}><span className={answers[i] ? "quiz-answer-mark correct" : "quiz-answer-mark"}>{answers[i] ? "✓" : "×"}</span><span>{q.question}<small>Answer: {q.answer}</small></span></div>)}</div>
          <button className="primary-button quiz-action" onClick={startAgain}><RotateCcw size={16}/> Play again</button>
        </section>
      ) : (
        <section className="quiz-panel quiz-playing">
          <div className="quiz-topline"><div className="eyebrow"><span className="pulse-dot"/> DAILY QUIZ</div><span className="quiz-count">QUESTION {index + 1} / {questions.length}</span></div>
          <div className="quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }}/></div>
          <div className="quiz-scoreline"><span>YOUR SCORE</span><strong>{score} <small>/ 100</small></strong></div>
          <h1>{current.question}</h1>
          <div className="quiz-options">{current.options.map((option, optionIndex) => <button type="button" key={option} className={selected === option ? "quiz-option selected" : "quiz-option"} onClick={() => setSelected(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>
          <button className="primary-button quiz-action" disabled={!selected} onClick={submitAnswer}>{index === questions.length - 1 ? "Finish quiz" : "Lock answer"} <ArrowRight size={16}/></button>
          <p className="quiz-small-note">Choose one answer to continue. Your result is stored only in this browser.</p>
        </section>
      )}
    </main>
  );
}
