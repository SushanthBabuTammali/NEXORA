"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Story = {
  id: number;
  category: string;
  title: string;
  dek: string;
  time: string;
  art: string;
  label: string;
};

const stories: Story[] = [
  {
    id: 1,
    category: "THE BIG PICTURE",
    title: "The next chapter of AI is being written in the open",
    dek: "Open models are moving from experiment to essential infrastructure. Here’s what changed—and what it means for everyone building with them.",
    time: "8 min read",
    art: "art-open",
    label: "Open models",
  },
  {
    id: 2,
    category: "FRONTIER WATCH",
    title: "A new kind of reasoning is taking shape",
    dek: "A plain-English guide to the latest advances in systems that can plan, check and revise their own work.",
    time: "6 min read",
    art: "art-reason",
    label: "Reasoning",
  },
  {
    id: 3,
    category: "AI, EXPLAINED",
    title: "What does an AI model actually know?",
    dek: "Inside the difference between memorising, predicting and understanding—and why the distinction matters.",
    time: "5 min read",
    art: "art-know",
    label: "Fundamentals",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? "arrow arrow-diagonal" : "arrow"}>↗</span>;
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="bookmark-icon" fill={filled ? "currentColor" : "none"}>
      <path d="M5.25 3.75h9.5v13l-4.75-3.2-4.75 3.2v-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [followed, setFollowed] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const filteredStories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return stories;
    return stories.filter((story) => `${story.title} ${story.dek} ${story.category} ${story.label}`.toLowerCase().includes(needle));
  }, [query]);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  function toggleSaved(id: number) {
    setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="Nexora home"><span className="wordmark-orb" />NEXORA</a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#stories">Stories</a>
            <a href="#moments">Moments</a>
            <a href="#models">Models</a>
            <a href="#companies">Companies</a>
          </nav>
          <div className="header-actions">
            <button className="icon-button search-button" type="button" aria-label={searchOpen ? "Close search" : "Search stories"} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setQuery(""); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4"/><path d="m15.5 15.5 4.3 4.3"/></svg>
            </button>
            <button className="icon-button theme-button" type="button" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} aria-pressed={dark} onClick={() => setDark((value) => !value)}>
              {dark ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.8"/><path d="M12 2.5v2M12 19.5v2M4.1 4.1l1.4 1.4m13 13 1.4 1.4M2.5 12h2m15 0h2M4.1 19.9l1.4-1.4m13-13 1.4-1.4"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 15.5A8.2 8.2 0 0 1 8.5 3.7a8.2 8.2 0 1 0 11.8 11.8Z"/></svg>}
            </button>
            <a className="you-link" href="#you">Your Nexora <span className="profile-dot">S</span></a>
          </div>
        </div>
        {searchOpen && (
          <div className="search-drawer">
            <label htmlFor="story-search">Search Nexora</label>
            <div className="search-field-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4"/><path d="m15.5 15.5 4.3 4.3"/></svg>
              <input id="story-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘models’ or ‘reasoning’" />
              <kbd>ESC</kbd>
            </div>
            <p aria-live="polite">{query ? `${filteredStories.length} ${filteredStories.length === 1 ? "story" : "stories"} found below` : "Search the stories on this page"}</p>
          </div>
        )}
      </header>

      <div className="sample-banner"><span className="sample-dot" /> A first look at Nexora <span className="banner-divider">/</span> Sample stories for this local preview</div>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />A clearer view of what’s next</p>
          <h1 id="hero-title">The future of AI.<br /><span>Beautifully understood.</span></h1>
          <p className="hero-dek">The ideas, people and breakthroughs shaping artificial intelligence—made clear, considered and worth your time.</p>
          <div className="hero-ctas">
            <a className="button button-dark" href="#stories">Explore today’s stories <Arrow /></a>
            <a className="text-link" href="#about">Get to know Nexora <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note"><span className="note-avatar">N</span><span>Curiosity, without the noise.</span><span className="note-separator">·</span><span>Made for people who think ahead.</span></div>
        </div>
        <div className="hero-art" aria-label="Nexora's luminous, layered signature orb" role="img">
          <div className="orb-scene">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <div className="orb-glow" /><div className="hero-orb"><div className="orb-shine" /><div className="orb-core" /></div>
            <span className="orb-label orb-label-one"><i /> Signals, connected</span>
            <span className="orb-label orb-label-two">A new perspective</span>
            <span className="orb-index">01 <span>/</span> 06</span>
            <div className="orb-caption"><span className="caption-rule" />Intelligence, in perspective</div>
          </div>
        </div>
        <div className="hero-bottom"><span>INDEPENDENT AI INTELLIGENCE</span><span>EDITION 001 <i /></span></div>
      </section>

      <section className="today-strip" aria-label="Today on Nexora">
        <div className="today-label"><span className="live-dot" />TODAY ON NEXORA</div>
        <p>AI is moving quickly. <span>Understanding it can feel effortless.</span></p>
        <a href="#stories" aria-label="Read today's stories"><Arrow /></a>
      </section>

      <section className="stories-section section-wrap" id="stories" aria-labelledby="stories-title">
        <div className="section-heading">
          <div><p className="eyebrow section-eyebrow">THE DAILY INTELLIGENCE</p><h2 id="stories-title">A little more <em>clarity.</em></h2><p className="section-intro">The most meaningful signals in AI, thoughtfully selected and clearly explained.</p></div>
          <a className="view-all" href="#stories">View all stories <Arrow /></a>
        </div>
        <div className="stories-grid" aria-live="polite">
          {filteredStories.map((story, index) => (
            <article className={`story-card ${index === 0 && !query ? "story-featured" : ""}`} key={story.id}>
              <a className={`story-art ${story.art}`} href="#about" aria-label={`Read ${story.title}`}>
                <span className="art-index">N° 0{story.id}</span>
                {story.id === 1 && <><div className="art-orbit art-orbit-a"/><div className="art-orbit art-orbit-b"/><div className="art-open-core"><span>OPEN<br/>INTELLIGENCE</span></div><span className="art-note">THE NEXT<br/>CHAPTER</span></>}
                {story.id === 2 && <><div className="reasoning-lines"><i/><i/><i/><i/><i/></div><div className="reasoning-node">?</div><span className="reasoning-caption">THINKING<br/>IN MOTION</span></>}
                {story.id === 3 && <><div className="knowledge-sun"/><div className="knowledge-ring ring-a"/><div className="knowledge-ring ring-b"/><span className="knowledge-caption">A MODEL<br/>OF THE WORLD</span></>}
              </a>
              <div className="story-meta"><span>{story.category}</span><span>{story.time}</span></div>
              <div className="story-title-row"><h3><a href="#about">{story.title}</a></h3><button className={`save-button ${saved.includes(story.id) ? "is-saved" : ""}`} type="button" onClick={() => toggleSaved(story.id)} aria-label={`${saved.includes(story.id) ? "Remove" : "Save"} ${story.title}`} aria-pressed={saved.includes(story.id)}><BookmarkIcon filled={saved.includes(story.id)} /></button></div>
              <p className="story-dek">{story.dek}</p>
              <a href="#about" className="story-read">Read the story <Arrow /></a>
            </article>
          ))}
          {filteredStories.length === 0 && <div className="empty-search"><span>⌕</span><h3>No stories found</h3><p>Try a different phrase, like “AI” or “models”.</p></div>}
        </div>
      </section>

      <section className="moments-section section-wrap" id="moments" aria-labelledby="moments-title">
        <div className="section-heading moments-heading"><div><p className="eyebrow section-eyebrow">A MOMENT TO UNDERSTAND</p><h2 id="moments-title">Big ideas. <em>Short watch.</em></h2><p className="section-intro">A minute can change how you see the world.</p></div><a className="view-all" href="#moments">Explore Moments <Arrow /></a></div>
        <a className="moment-feature" href="#about">
          <div className="moment-art"><div className="moment-sun"/><div className="moment-wave wave-one"/><div className="moment-wave wave-two"/><div className="moment-play"><span>▶</span></div><span className="moment-duration">01:24</span><span className="moment-art-label">AN IDEA, IN A MOMENT</span></div>
          <div className="moment-copy"><span className="moment-tag">MOMENT 001 <span>·</span> FOUNDATIONS</span><h3>So, what is an AI model?</h3><p>Think of it as a map of patterns. One that gets a little more detailed with every question.</p><span className="moment-link">Watch the 84-second explainer <Arrow /></span><span className="moment-counter">01 <i>/</i> 12</span></div>
        </a>
      </section>

      <section className="explore-section section-wrap" id="models" aria-labelledby="explore-title">
        <div className="section-heading"><div><p className="eyebrow section-eyebrow">EXPLORE THE LANDSCAPE</p><h2 id="explore-title">The bigger <em>picture.</em></h2><p className="section-intro">Go beyond the headline. Find the context behind what’s changing.</p></div><a className="view-all" href="#companies">Explore the landscape <Arrow /></a></div>
        <div className="explore-grid">
          <a className="explore-card models-card" id="models-detail" href="#stories"><span className="explore-number">01 / MODELS</span><div className="model-symbol"><div className="model-disc disc-a"/><div className="model-disc disc-b"/><div className="model-disc disc-c"/><span>MODEL<br/>ATLAS</span></div><div className="explore-card-bottom"><div><h3>Models, made legible.</h3><p>Compare capabilities, releases and what’s changed.</p></div><span className="circle-arrow"><Arrow /></span></div></a>
          <a className="explore-card companies-card" id="companies" href="#stories"><span className="explore-number">02 / COMPANIES</span><div className="company-constellation"><span className="constellation-star star-a"/><span className="constellation-star star-b"/><span className="constellation-star star-c"/><span className="constellation-star star-d"/><span className="constellation-star star-e"/><i className="constellation-line line-a"/><i className="constellation-line line-b"/><i className="constellation-line line-c"/><i className="constellation-line line-d"/><div className="constellation-core">A</div></div><div className="explore-card-bottom"><div><h3>Meet the people moving AI.</h3><p>Follow the labs, leaders and decisions shaping the field.</p></div><span className="circle-arrow"><Arrow /></span></div></a>
        </div>
      </section>

      <section className="you-section" id="you" aria-labelledby="you-title">
        <div className="you-inner section-wrap">
          <div className="you-copy"><p className="eyebrow"><span className="eyebrow-line"/>YOUR VIEW, YOURS</p><h2 id="you-title">A smarter feed<br/>starts with <em>you.</em></h2><p>Save what matters. Follow the ideas you care about. Build a daily briefing that feels like it was made for you.</p><a href="#your-profile" className="button button-light">Shape your Nexora <Arrow /></a></div>
          <div className="profile-preview" id="your-profile"><div className="profile-preview-head"><span className="profile-preview-kicker">YOUR NEXORA</span><span className="profile-preview-avatar">S</span></div><div className="profile-greeting">Good morning,<br/><strong>Sam.</strong></div><div className="profile-rule"/><div className="profile-interests"><span>YOUR INTERESTS</span><div><i>AI & Society</i><i>Frontier models</i><i>Open source</i><button type="button" className={followed ? "following" : ""} onClick={() => setFollowed((value) => !value)} aria-pressed={followed}>{followed ? "Following +" : "+ Follow AI"}</button></div></div><div className="profile-saved"><span>SAVED FOR LATER</span><div><span className="saved-marker">{saved.length.toString().padStart(2,"0")}</span><p>{saved.length ? `${saved.length} thoughtful ${saved.length === 1 ? "read" : "reads"}, ready when you are.` : "Your reading list, all in one place."}</p><BookmarkIcon /></div></div><div className="profile-footer"><span>YOUR DAILY BRIEFING</span><span>8:00 AM <i/></span></div></div>
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div><p className="eyebrow section-eyebrow">A NOTE ON NEXORA</p><h2>Good information<br/>should feel <em>human.</em></h2></div><div className="about-copy"><p>Nexora is an independent guide to artificial intelligence. We connect the headlines to the bigger picture, explain the unfamiliar and make space for a more considered conversation.</p><a className="story-read" href="#top">A little more about us <Arrow /></a></div>
      </section>

      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="newsletter-inner"><div><p className="eyebrow"><span className="eyebrow-line"/>A CLEARER START TO YOUR DAY</p><h2 id="newsletter-title">A little clarity,<br/><em>delivered.</em></h2><p className="newsletter-dek">The week in AI, made clear. A thoughtful note in your inbox, every Sunday.</p></div><form className="newsletter-form" onSubmit={handleSubscribe}><label htmlFor="newsletter-email">Your email address</label><div className="newsletter-field"><input id="newsletter-email" type="email" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} disabled={subscribed}/><button type="submit" disabled={subscribed}>{subscribed ? "You’re on the list ✓" : "Join the briefing"}{!subscribed && <Arrow />}</button></div><p aria-live="polite">{subscribed ? "Thanks for joining. Your Sunday briefing is on its way." : "No noise. Just the signal. Unsubscribe whenever you like."}</p></form><div className="newsletter-orb" aria-hidden="true"/></div>
      </section>

      <footer className="site-footer"><div className="footer-main"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-orb"/>NEXORA</a><p>Understand what’s next.</p><div className="footer-links"><a href="#stories">Stories</a><a href="#moments">Moments</a><a href="#models">Models</a><a href="#companies">Companies</a><a href="#you">Your Nexora</a></div><a className="back-top" href="#top">Back to top ↑</a></div><div className="footer-bottom"><span>© 2026 NEXORA. A clearer view of what’s next.</span><span>MADE FOR THE CURIOUS <i/></span></div></footer>
    </main>
  );
}
