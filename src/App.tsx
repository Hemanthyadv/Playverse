import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Archive, CalendarDays, Check, Gamepad2, Home, Info, Menu, Search, Sparkles, Trophy, X } from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import SizeItUp from "./games/SizeItUp";

type Game = { id: string; title: string; type: string; description: string; tone: string; mark: string; status: string; };
const games: Game[] = [
  { id: "01", title: "Size It Up", type: "ESTIMATION", description: "Trust your eye. Estimate the size of everyday things.", tone: "lilac", mark: "◒", status: "FIRST GAME IN DEVELOPMENT" },
  { id: "02", title: "Higher or Lower", type: "NUMBER SENSE", description: "Make the right call before the next number appears.", tone: "peach", mark: "↗", status: "PLANNED" },
  { id: "03", title: "Daily Quiz", type: "TRIVIA", description: "A few curious questions to give your brain a workout.", tone: "lime", mark: "✳", status: "PLANNED" },
];
const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/daily", label: "Daily challenge", icon: CalendarDays },
  { to: "/archive", label: "Archive", icon: Archive },
  { to: "/about", label: "About", icon: Info },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  return <header className="topbar">
    <Link className="brand" to="/" aria-label="Playverse home" onClick={closeMenu}><span className="brand-icon"><Gamepad2 size={20}/></span><span>playverse<span className="lime-text">.</span></span></Link>
    <nav className={menuOpen ? "main-nav nav-open" : "main-nav"} aria-label="Main navigation">
      {navItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={closeMenu} className={({isActive}) => isActive ? "nav-link nav-active" : "nav-link"}><item.icon size={15}/>{item.label}</NavLink>)}
    </nav>
    <Link className="header-cta" to="/games">Find your next game <ArrowUpRight size={15}/></Link>
    <button className="mobile-menu" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
    {menuOpen && <button className="menu-scrim" aria-label="Close navigation menu" onClick={closeMenu} />}
    <span className="sr-only" aria-live="polite">Current page: {location.pathname}</span>
  </header>;
}
function Footer() {
  return <footer className="site-footer"><Link className="brand" to="/"><span className="brand-icon"><Gamepad2 size={17}/></span><span>playverse<span className="lime-text">.</span></span></Link><span>Made for the curious. © {new Date().getFullYear()} Playverse</span><Link to="/about">Built for curious minds</Link></footer>;
}
function Eyebrow({children}:{children:ReactNode}) { return <div className="eyebrow"><span className="pulse-dot"/>{children}</div>; }
function GameCard({game}:{game:Game}) {
  return <article className="game-card">
    <div className="card-top"><span>{game.id} / GAME</span><span className="card-arrow"><ArrowUpRight size={17}/></span></div>
    <div className={`game-art ${game.tone}`} aria-hidden="true"><span>{game.mark}</span><i/><i/><i/></div>
    <div className="game-type">{game.type}</div><h3>{game.title}</h3><p>{game.description}</p>
    <div className="card-status"><span/> {game.status}</div>{game.id === "01" && <Link className="card-play-link" to="/games/size-it-up">Play now <ArrowRight size={14}/></Link>}
  </article>;
}
function HomePage() {
  return <>
    <section className="hero" id="daily">
      <div className="hero-copy"><Eyebrow>YOUR DAILY DOSE OF PLAY</Eyebrow>
        <h1>A little play.<br/><span>A sharper mind.</span></h1>
        <p>Quick games, curious challenges, and tiny victories. Take a break, test your instincts, and see what you know.</p>
        <div className="hero-actions"><Link className="primary-button" to="/games">Explore the games <ArrowUpRight size={17}/></Link><span className="free-note"><Sparkles size={15}/> Free to play. Made for curious minds.</span></div>
      </div>
      <div className="hero-art" aria-label="Playful abstract puzzle illustration" role="img">
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        <div className="question-card"><small>THINK DIFFERENT</small><strong>?</strong><span>EVERY DAY IS A NEW PUZZLE</span></div>
        <div className="mood-card"><small>TODAY'S MOOD</small><div className="shapes"><i/><i/><i/></div><strong>Curious.</strong><span>That looks good on you.</span></div>
        <span className="spark spark-a">✳</span><span className="spark spark-b">✦</span><span className="float-pill">PLAY A LITTLE <b>↗</b></span>
      </div>
      <div className="hero-caption"><span>GOOD THINGS HAPPEN WHEN YOU PLAY</span><span>01 — DISCOVER SOMETHING NEW</span></div>
    </section>
    <section className="games-section" id="games">
      <div className="section-heading"><div><div className="eyebrow">THE PLAYGROUND</div><h2>Pick your kind of fun<span className="lime-text">.</span></h2></div><Link className="text-link" to="/games">Browse all games <ArrowRight size={15}/></Link></div>
      <div className="games-grid">{games.map(game=><GameCard key={game.id} game={game}/>)}</div>
    </section>
    <section className="manifesto" id="about"><div className="trophy-icon"><Trophy size={22}/></div><div><div className="eyebrow">A FRIENDLY REMINDER</div><h2>You don't have to be the best.<br/><em>Just be up for it.</em></h2></div><p>Playverse is being built for the joy of figuring things out. No pressure, no complicated setup — just good games and the satisfaction of getting a little better.</p></section>
  </>;
}
function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <div className="page-intro"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div>;
}
function GamesPage() {
  const [query,setQuery] = useState("");
  const filtered = games.filter(game => `${game.title} ${game.type} ${game.description}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="inner-page"><PageIntro eyebrow="THE PLAYGROUND" title="Find your next favourite." description="A growing collection of small games for curious minds. We're building the first playable experience now."/>
    <label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search games..." aria-label="Search games"/></label>
    {filtered.length ? <div className="games-grid">{filtered.map(game=><GameCard key={game.id} game={game}/>)}</div> : <div className="empty-state"><Search size={25}/><h2>No games found</h2><p>Try another title or search term.</p><button className="secondary-button" onClick={()=>setQuery("")}>Clear search</button></div>}
    <p className="page-footnote">Game cards marked planned or in development are previews and cannot be played yet.</p>
  </main>;
}
function DailyPage() {
  return <main className="inner-page"><PageIntro eyebrow="A FRESH CHALLENGE, EVERY DAY" title="Your daily moment of play." description="Daily challenges are coming soon. We're building a fair, repeatable puzzle experience with a clear score and a satisfying reveal."/>
    <section className="feature-panel"><div className="feature-symbol"><CalendarDays size={30}/></div><div className="feature-copy"><span className="status-label"><span/> IN DEVELOPMENT</span><h2>A new challenge is on its way.</h2><p>The first daily challenge will arrive with our Size It Up game. Each puzzle will have a stable answer, so everyone gets a fair shot.</p><Link className="primary-button" to="/games">See the game roadmap <ArrowRight size={16}/></Link></div></section>
  </main>;
}
function ArchivePage() {
  return <main className="inner-page"><PageIntro eyebrow="THE REPLAY SHELF" title="Good games are worth another go." description="Once daily puzzles launch, the archive will make previous challenges easy to find and replay."/>
    <div className="empty-state archive-empty"><div className="archive-icon"><Archive size={27}/></div><h2>Your archive is getting ready.</h2><p>No past challenges are available yet. We’ll list them here when daily games launch.</p><Link className="secondary-link" to="/games">Explore planned games <ArrowRight size={15}/></Link></div>
  </main>;
}
function AboutPage() {
  return <main className="inner-page"><PageIntro eyebrow="WHY PLAYVERSE?" title="A little play goes a long way." description="Playverse is an independent mini-game platform built around quick challenges, thoughtful design and the fun of learning something new."/>
    <div className="about-grid"><article><span className="about-number">01</span><h2>Easy to jump into</h2><p>Clear rules and short rounds, so you can play during a quick break.</p></article><article><span className="about-number">02</span><h2>Made for curiosity</h2><p>Estimation, trivia and clever puzzles reward observation as much as knowledge.</p></article><article><span className="about-number">03</span><h2>Built in the open</h2><p>Playverse is being developed iteratively, with a public roadmap and a focus on quality.</p></article></div>
    <div className="about-note"><Check size={18}/><p>We're starting small and testing carefully. Features will be labelled honestly as they become available.</p></div>
  </main>;
}
function NotFoundPage() {
  return <main className="inner-page not-found"><div className="not-found-code">404</div><h1>This page wandered off.</h1><p>That link doesn't lead to a Playverse page yet.</p><Link className="primary-button" to="/"><ArrowLeft size={16}/> Back to home</Link></main>;
}
export default function App() {
  return <div className="app-shell"><Header/><Routes>
    <Route path="/" element={<HomePage/>}/><Route path="/games" element={<GamesPage/>}/><Route path="/games/size-it-up" element={<SizeItUp/>}/><Route path="/daily" element={<DailyPage/>}/><Route path="/archive" element={<ArchivePage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Routes><Footer/></div>;
}