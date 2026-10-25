import { ArrowUpRight, Gamepad2, Sparkles, Trophy } from "lucide-react";

const games = [
  { id: "01", title: "Size It Up", type: "ESTIMATION", description: "Trust your eye. Estimate the size of everyday things.", tone: "lilac", mark: "◒", status: "UP NEXT" },
  { id: "02", title: "Higher or Lower", type: "NUMBER SENSE", description: "Make the right call before the next number appears.", tone: "peach", mark: "↗", status: "ON THE ROADMAP" },
  { id: "03", title: "Daily Quiz", type: "TRIVIA", description: "A few curious questions to give your brain a workout.", tone: "lime", mark: "✳", status: "ON THE ROADMAP" },
];

export default function App() {
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Playverse home"><span className="brand-icon"><Gamepad2 size={20}/></span><span>playverse<span className="lime-text">.</span></span></a>
      <nav aria-label="Main navigation"><a className="nav-active" href="#games">Explore games</a><a href="#daily">Daily challenge</a><a href="#about">About</a></nav>
      <a className="header-cta" href="#games">Find your next game <ArrowUpRight size={15}/></a>
    </header>
    <main>
      <section className="hero" id="daily">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> YOUR DAILY DOSE OF PLAY</div>
          <h1>A little play.<br/><span>A sharper mind.</span></h1>
          <p>Quick games, curious challenges, and tiny victories. Take a break, test your instincts, and see what you know.</p>
          <div className="hero-actions"><a className="primary-button" href="#games">Explore the games <ArrowUpRight size={17}/></a><span className="free-note"><Sparkles size={15}/> Free to play. Made for curious minds.</span></div>
        </div>
        <div className="hero-art" aria-label="Playful abstract puzzle illustration">
          <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
          <div className="question-card"><small>THINK DIFFERENT</small><strong>?</strong><span>EVERY DAY IS A NEW PUZZLE</span></div>
          <div className="mood-card"><small>TODAY'S MOOD</small><div className="shapes"><i/><i/><i/></div><strong>Curious.</strong><span>That looks good on you.</span></div>
          <span className="spark spark-a">✳</span><span className="spark spark-b">✦</span><span className="float-pill">PLAY A LITTLE <b>↗</b></span>
        </div>
        <div className="hero-caption"><span>GOOD THINGS HAPPEN WHEN YOU PLAY</span><span>01 — DISCOVER SOMETHING NEW</span></div>
      </section>
      <section className="games-section" id="games">
        <div className="section-heading"><div><div className="eyebrow">THE PLAYGROUND</div><h2>Pick your kind of fun<span className="lime-text">.</span></h2></div><p>Small games. Big “one more round” energy.</p></div>
        <div className="games-grid">{games.map(game=><article className="game-card" key={game.id}>
          <div className="card-top"><span>{game.id} / GAME</span><span className="card-arrow"><ArrowUpRight size={17}/></span></div>
          <div className={`game-art ${game.tone}`} aria-hidden="true"><span>{game.mark}</span><i/><i/><i/></div>
          <div className="game-type">{game.type}</div><h3>{game.title}</h3><p>{game.description}</p>
          <div className="card-status"><span/> {game.status}</div>
        </article>)}</div>
      </section>
      <section className="manifesto" id="about"><div className="trophy-icon"><Trophy size={22}/></div><div><div className="eyebrow">A FRIENDLY REMINDER</div><h2>You don't have to be the best.<br/><em>Just be up for it.</em></h2></div><p>Playverse is being built for the joy of figuring things out. No pressure, no complicated setup — just good games and the satisfaction of getting a little better.</p></section>
    </main>
    <footer><a className="brand" href="#"><span className="brand-icon"><Gamepad2 size={17}/></span><span>playverse<span className="lime-text">.</span></span></a><span>Made for the curious. © {new Date().getFullYear()} Playverse</span><a href="#daily">Back to top ↑</a></footer>
  </div>;
}