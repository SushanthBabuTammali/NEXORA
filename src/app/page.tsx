"use client";

import { useEffect, useMemo, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

type Story = {
  id: number;
  category: string;
  title: string;
  dek: string;
  time: string;
  label: string;
  image: string;
  video?: string;        // optional reel/video URL
  duration?: string;     // e.g. "01:24"
  excitement?: number;   // 1-10 excitement score
};

type NewsSource = {
  name: string;
  url: string;
};

// ============================================================================
// LIVE NEWS DATA STORE (real curated AI stories with fallback)
// In production this is populated by /api/news route & live RSS/LLM curation.
// ============================================================================

const LIVE_STORIES: Story[] = [
  {
    id: 1,
    category: "THE BIG PICTURE",
    title: "Open-Source AI Just Changed Everything",
    dek: "The next chapter of AI is being written in the open—models moving from experiment to essential infrastructure for everyone building tomorrow.",
    time: "8 min read",
    label: "Open models",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
    video: undefined,
    excitement: 9,
  },
  {
    id: 2,
    category: "FRONTIER WATCH",
    title: "Reasoning Models Can Now Plan Their Own Work",
    dek: "A new kind of reasoning takes shape—systems that can think, check, and revise before they answer, like a chess master seeing ten moves ahead.",
    time: "6 min read",
    label: "Reasoning",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop",
    video: "https://media.githubusercontent.com/media/SushanthBabuTammali/NEXORA/main/public/demo-reel-1.mp4",
    duration: "01:24",
    excitement: 10,
  },
  {
    id: 3,
    category: "AI, EXPLAINED",
    title: "What Does an AI Model Actually Know?",
    dek: "Inside memorizing vs predicting vs understanding—why the distinction matters more than you think.",
    time: "5 min read",
    label: "Fundamentals",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
    video: undefined,
    excitement: 7,
  },
  {
    id: 4,
    category: "THE BIG PICTURE",
    title: "NVIDIA’s Blackwell Chips Arrive—And They’re Fast",
    dek: "The new Blackwell architecture doesn’t just train models faster. It redefines what’s possible in real-time inference.",
    time: "7 min read",
    label: "Hardware",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop",
    video: undefined,
    excitement: 8,
  },
  {
    id: 5,
    category: "FRONTIER WATCH",
    title: "AI Agents That Browse the Web for You",
    dek: "Meet the first agents that can click, type, and research on your behalf while you sleep.",
    time: "4 min read",
    label: "Agents",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop",
    video: "https://media.githubusercontent.com/media/SushanthBabuTammali/NEXORA/main/public/demo-reel-2.mp4",
    duration: "00:58",
    excitement: 9,
  },
  {
    id: 6,
    category: "AI, EXPLAINED",
    title: "Multimodal Models See, Hear, and Speak",
    dek: "Text is old news. The frontier models now understand images, audio, and video natively.",
    time: "6 min read",
    label: "Multimodal",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
    video: undefined,
    excitement: 8,
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

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

function PlayBadge() {
  return (
    <div className="play-badge" aria-hidden="true">
      <span>▶</span> WATCH
    </div>
  );
}

// ============================================================================
// HOME PAGE
// ============================================================================

export default function Home() {
  // --- UI state -------------------------------------------------------------
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [followed, setFollowed] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [liveStories, setLiveStories] = useState<Story[]>([]);
  const [streak, setStreak] = useState(0);

  // --- Streak: count consecutive daily visits (stored in localStorage) -------
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("nexora:visits");
    const visits = stored ? JSON.parse(stored) : [];

    if (!visits.includes(today)) {
      visits.push(today);
      localStorage.setItem("nexora:visits", JSON.stringify(visits));
    }

    // Count streak: consecutive days ending today
    let currentStreak = 0;
    let check = new Date();
    while (true) {
      const d = check.toDateString();
      if (visits.includes(d)) {
        currentStreak++;
        check = new Date(check.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  // --- Fetch live news from API route ---------------------------------------
  useEffect(() => {
    let cancelled = false;
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (data.stories && data.stories.length > 0) {
            setLiveStories(data.stories);
          }
        }
      } catch {
        // silent fallback to LIVE_STORIES below
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    }
    fetchNews();
    return () => { cancelled = true; };
  }, []);

  // Show live stories if loaded, otherwise fall back to curated store
  const stories: Story[] = useMemo(
    () => (liveStories.length > 0 ? liveStories : LIVE_STORIES),
    [liveStories]
  );

  // --- Search filter --------------------------------------------------------
  const filteredStories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return stories;
    return stories.filter(
      (s) =>
        `${s.title} ${s.dek} ${s.category} ${s.label}`.toLowerCase().includes(needle)
    );
  }, [query, stories]);

  // --- Actions --------------------------------------------------------------
  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  function toggleSaved(id: number) {
    setSaved((items) => (items.includes(id) ? items.filter((i) => i !== id) : [...items, id]));
  }

  // --- Render ---------------------------------------------------------------
  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Header with streak badge */}
      <header className="site-header">
        <div className="header-inner">
          <div className="streak-badge" aria-label={`Daily streak: ${streak} days`}>
            <span className="streak-label">🔥 Streak</span>
            <span className="streak-count">{streak}</span>
          </div>
          <a className="wordmark" href="#top" aria-label="Nexora home">
            <span className="wordmark-orb" />NEXORA
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#stories">Stories</a>
            <a href="#reels">Reels</a>
            <a href="#moments">Moments</a>
            <a href="#models">Models</a>
            <a href="#companies">Companies</a>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-button"
              type="button"
              aria-label={searchOpen ? "Close search" : "Search stories"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.4" />
                <path d="m15.5 15.5 4.3 4.3" />
              </svg>
            </button>
            <button
              className="icon-button theme-button"
              type="button"
              aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
              aria-pressed={dark}
              onClick={() => setDark((v) => !v)}
            >
              {dark ? (
                <>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="3.8" />
                    <path d="M12 2.5v2M12 19.5v2M4.1 4.1l1.4 1.4m13 13 1.4 1.4M2.5 12h2m15 0h2M4.1 19.9l1.4-1.4m13-13 1.4-1.4" />
                  </svg>
                </>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.3 15.5A8.2 8.2 0 0 1 8.5 3.7a8.2 8.2 0 1 0 11.8 11.8Z" />
                </svg>
              )}
            </button>
            <a className="you-link" href="#you">
              Your Nexora <span className="profile-dot">S</span>
            </a>
          </div>
        </div>
        {searchOpen && (
          <div className="search-drawer">
            <label htmlFor="story-search">Search Nexora</label>
            <div className="search-field-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.4" />
                <path d="m15.5 15.5 4.3 4.3" />
              </svg>
              <input
                id="story-search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try ‘models’ or ‘reasoning’"
              />
              <kbd>ESC</kbd>
            </div>
            <p aria-live="polite">
              {query ? `${filteredStories.length} ${filteredStories.length === 1 ? "story" : "stories"} found below` : "Search today’s AI intelligence"}
            </p>
          </div>
        )}
      </header>

      {/* Today strip */}
      <section className="today-strip" aria-label="Today on Nexora">
        <div className="today-label">
          <span className="live-dot" />TODAY ON NEXORA
        </div>
        <p>
          AI is moving quickly. <span>Understanding it can feel effortless.</span>
        </p>
        <a href="#stories" aria-label="Read today's stories">
          <Arrow />
        </a>
      </section>

      {/* Hero */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />A clearer view of what’s next
          </p>
          <h1 id="hero-title">The future of AI.<br /><span>Beautifully understood.</span></h1>
          <p className="hero-dek">
            The ideas, people and breakthroughs shaping artificial intelligence—made clear,
            considered and worth your time.
          </p>
          <div className="hero-ctas">
            <a className="button button-dark" href="#stories">
              Explore today’s stories <Arrow />
            </a>
            <a className="text-link" href="#about">Get to know Nexora <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note">
            <span className="note-avatar">N</span>
            <span>Curiosity, without the noise.</span>
            <span className="note-separator">·</span>
            <span>Made for people who think ahead.</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Nexora's luminous, layered signature orb" role="img">
          <div className="orb-scene">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="orb-glow" />
            <div className="hero-orb">
              <div className="orb-shine" />
              <div className="orb-core" />
            </div>
            <span className="orb-label orb-label-one"><i /> Signals, connected</span>
            <span className="orb-label orb-label-two">A new perspective</span>
            <span className="orb-index">01 <span> / </span> 06</span>
            <div className="orb-caption">
              <span className="caption-rule" /> Intelligence, in perspective
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>INDEPENDENT AI INTELLIGENCE</span>
          <span>EDITION {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} <i /></span>
        </div>
      </section>

      {/* Stories grid */}
      <section className="stories-section section-wrap" id="stories" aria-labelledby="stories-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-eyebrow">THE DAILY INTELLIGENCE</p>
            <h2 id="stories-title">A little more <em>clarity.</em></h2>
            <p className="section-intro">The most meaningful signals in AI, thoughtfully selected and clearly explained.</p>
          </div>
          <a className="view-all" href="#stories">View all stories <Arrow /></a>
        </div>
        <div className="stories-grid" aria-live="polite">
          {filteredStories.map((story, index) => (
            <article
              className={`story-card ${index === 0 && !query ? "story-featured" : ""}`}
              key={story.id}
            >
              <a
                className={`story-art art-${story.id === 1 ? "open" : story.id === 2 ? "reason" : story.id === 3 ? "know" : "photo"}`}
                href="#about"
                aria-label={`Read ${story.title}`}
              >
                <span className="art-index">N° 0{story.id}</span>
                {story.video && (
                  <>
                    <video
                      className="reel-preview"
                      muted
                      loop
                      playsInline
                      poster={story.image}
                    >
                      <source src={story.video} type="video/mp4" />
                    </video>
                    <PlayBadge />
                  </>
                )}
                {story.id === 1 && (
                  <>
                    <div className="art-orbit art-orbit-a" />
                    <div className="art-orbit art-orbit-b" />
                    <div className="art-open-core"><span>OPEN<br/>INTELLIGENCE</span></div>
                    <span className="art-note">THE NEXT<br/>CHAPTER</span>
                  </>
                )}
                {story.id === 2 && (
                  <>
                    <div className="reasoning-lines">
                      <i /><i /><i /><i /><i />
                    </div>
                    <div className="reasoning-node">?</div>
                    <span className="reasoning-caption">THINKING<br/>IN MOTION</span>
                  </>
                )}
                {story.id === 3 && (
                  <>
                    <div className="knowledge-sun" />
                    <div className="knowledge-ring ring-a" />
                    <div className="knowledge-ring ring-b" />
                    <span className="knowledge-caption">A MODEL<br/>OF THE WORLD</span>
                  </>
                )}
                {!story.video && story.id !== 1 && story.id !== 2 && story.id !== 3 && (
                  <img src={story.image} alt={`Art for ${story.title}`} className="story-thumb" />
                )}
              </a>
              <div className="story-meta">
                <span>{story.category}</span>
                <span>{story.time}</span>
              </div>
              <div className="story-title-row">
                <h3><a href="#about">{story.title}</a></h3>
                <button
                  className={`save-button ${saved.includes(story.id) ? "is-saved" : ""}`}
                  type="button"
                  onClick={() => toggleSaved(story.id)}
                  aria-label={saved.includes(story.id) ? `Remove ${story.title}` : `Save ${story.title}`}
                  aria-pressed={saved.includes(story.id)}
                >
                  <BookmarkIcon filled={saved.includes(story.id)} />
                </button>
              </div>
              <p className="story-dek">{story.dek}</p>
              <a href="#about" className="story-read">
                Read the story <Arrow />
              </a>
            </article>
          ))}
          {filteredStories.length === 0 && (
            <div className="empty-search">
              <span>⌕</span>
              <h3>No stories found</h3>
              <p>Try a different phrase, like “AI” or “models”.</p>
            </div>
          )}
        </div>
      </section>

      {/* Reels section */}
      <section className="reels-section section-wrap" id="reels" aria-labelledby="reels-title">
        <div className="section-heading reels-heading">
          <div>
            <p className="eyebrow section-eyebrow">AI IN MOTION</p>
            <h2 id="reels-title">Big ideas. <em>Short watch.</em></h2>
            <p className="section-intro">A minute can change how you see the world.</p>
          </div>
          <a className="view-all" href="#reels">Explore Reels <Arrow /></a>
        </div>
        <div className="reels-grid">
          {stories
            .filter((s) => s.video)
            .map((story) => (
              <a
                className="reel-card"
                key={story.id}
                href="#about"
                aria-label={`Watch ${story.title}`}
              >
                <div className="reel-art">
                  <video muted loop playsInline poster={story.image}>
                    <source src={story.video} type="video/mp4" />
                  </video>
                  <PlayBadge />
                  <span className="reel-duration">{story.duration}</span>
                </div>
                <div className="reel-copy">
                  <span className="reel-tag">{story.category}</span>
                  <h3>{story.title}</h3>
                  <p>{story.dek}</p>
                </div>
              </a>
            ))}
        </div>
      </section>

      {/* Moments */}
      <section className="moments-section section-wrap" id="moments" aria-labelledby="moments-title">
        <div className="section-heading moments-heading">
          <div>
            <p className="eyebrow section-eyebrow">A MOMENT TO UNDERSTAND</p>
            <h2 id="moments-title">Big ideas. <em>Short watch.</em></h2>
            <p className="section-intro">A minute can change how you see the world.</p>
          </div>
          <a className="view-all" href="#moments">Explore Moments <Arrow /></a>
        </div>
        <a className="moment-feature" href="#about">
          <div className="moment-art">
            <div className="moment-sun" />
            <div className="moment-wave wave-one" />
            <div className="moment-wave wave-two" />
            <div className="moment-play"><span>▶</span></div>
            <span className="moment-duration">01:24</span>
            <span className="moment-art-label">AN IDEA, IN A MOMENT</span>
          </div>
          <div className="moment-copy">
            <span className="moment-tag">MOMENT 001 <span> · </span> FOUNDATIONS</span>
            <h3>So, what is an AI model?</h3>
            <p>Think of it as a map of patterns. One that gets a little more detailed with every question.</p>
            <span className="moment-link">Watch the 84-second explainer <Arrow /></span>
            <span className="moment-counter">01 <i> / </i> 12</span>
          </div>
        </a>
      </section>

      {/* Explore */}
      <section className="explore-section section-wrap" id="models" aria-labelledby="explore-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-eyebrow">EXPLORE THE LANDSCAPE</p>
            <h2 id="explore-title">The bigger <em>picture.</em></h2>
            <p className="section-intro">Go beyond the headline. Find the context behind what’s changing.</p>
          </div>
          <a className="view-all" href="#companies">Explore the landscape <Arrow /></a>
        </div>
        <div className="explore-grid">
          <a
            className="explore-card models-card"
            id="models-detail"
            href="#stories"
          >
            <span className="explore-number">01 / MODELS</span>
            <div className="model-symbol">
              <div className="model-disc disc-a" />
              <div className="model-disc disc-b" />
              <div className="model-disc disc-c" />
              <span>MODEL<br/>ATLAS</span>
            </div>
            <div className="explore-card-bottom">
              <div>
                <h3>Models, made legible.</h3>
                <p>Compare capabilities, releases and what’s changed.</p>
              </div>
              <span className="circle-arrow"><Arrow /></span>
            </div>
          </a>
          <a
            className="explore-card companies-card"
            id="companies"
            href="#stories"
          >
            <span className="explore-number">02 / COMPANIES</span>
            <div className="company-constellation">
              <span className="constellation-star star-a" />
              <span className="constellation-star star-b" />
              <span className="constellation-star star-c" />
              <span className="constellation-star star-d" />
              <span className="constellation-star star-e" />
              <i className="constellation-line line-a" />
              <i className="constellation-line line-b" />
              <i className="constellation-line line-c" />
              <i className="constellation-line line-d" />
              <div className="constellation-core">A</div>
            </div>
            <div className="explore-card-bottom">
              <div>
                <h3>Meet the people moving AI.</h3>
                <p>Follow the labs, leaders and decisions shaping the field.</p>
              </div>
              <span className="circle-arrow"><Arrow /></span>
            </div>
          </a>
        </div>
      </section>

      {/* You */}
      <section className="you-section" id="you" aria-labelledby="you-title">
        <div className="you-inner section-wrap">
          <div className="you-copy">
            <p className="eyebrow"><span className="eyebrow-line" />YOUR VIEW, YOURS</p>
            <h2 id="you-title">A smarter feed starts with <em>you.</em></h2>
            <p>Save what matters. Follow the ideas you care about. Build a daily briefing that feels like it was made for you.</p>
            <a href="#your-profile" className="button button-light">Shape your Nexora <Arrow /></a>
          </div>
          <div className="profile-preview" id="your-profile">
            <div className="profile-preview-head">
              <span className="profile-preview-kicker">YOUR NEXORA</span>
              <span className="profile-preview-avatar">S</span>
            </div>
            <div className="profile-greeting">
              Good morning,<br /> <strong>Sam.</strong>
            </div>
            <div className="profile-rule" />
            <div className="profile-interests">
              <span>YOUR INTERESTS</span>
              <div>
                <i>AI & Society</i>
                <i>Frontier models</i>
                <i>Open source</i>
                <button
                  type="button"
                  className={followed ? "following" : ""}
                  onClick={() => setFollowed((v) => !v)}
                  aria-pressed={followed}
                >
                  {followed ? "Following +" : "+ Follow AI"}
                </button>
              </div>
            </div>
            <div className="profile-saved">
              <span>SAVED FOR LATER</span>
              <div>
                <span className="saved-marker">{saved.length.toString().padStart(2, "0")}</span>
                <p>
                  {saved.length ? `${saved.length} thoughtful ${saved.length === 1 ? "read" : "reads"}, ready when you are.` : "Your reading list, all in one place."}
                </p>
                <BookmarkIcon />
              </div>
            </div>
            <div className="profile-footer">
              <span>YOUR DAILY BRIEFING</span>
              <span>8:00 AM <i /></span>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section section-wrap" id="about">
        <div>
          <p className="eyebrow section-eyebrow">A NOTE ON NEXORA</p>
          <h2>Good information should feel <em>human.</em></h2>
        </div>
        <div className="about-copy">
          <p>Nexora is an independent guide to artificial intelligence. We connect the headlines to the bigger picture, explain the unfamiliar and make space for a more considered conversation.</p>
          <a className="story-read" href="#top">A little more about us <Arrow /></a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="newsletter-inner">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />A CLEARER START TO YOUR DAY</p>
            <h2 id="newsletter-title">A little clarity,<br /><em>delivered.</em></h2>
            <p className="newsletter-dek">The week in AI, made clear. A thoughtful note in your inbox, every Sunday.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email">Your email address</label>
            <div className="newsletter-field">
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
              />
              <button type="submit" disabled={subscribed}>
                {subscribed ? "You’re on the list ✓" : "Join the briefing"}
                {!subscribed && <Arrow />}
              </button>
            </div>
            <p aria-live="polite">
              {subscribed ? "Thanks for joining. Your Sunday briefing is on its way." : "No noise. Just the signal. Unsubscribe whenever you like."}
            </p>
          </form>
          <div className="newsletter-orb" aria-hidden="true" />
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <a className="wordmark footer-wordmark" href="#top">
            <span className="wordmark-orb" />NEXORA
          </a>
          <p>Understand what’s next.</p>
          <div className="footer-links">
            <a href="#stories">Stories</a>
            <a href="#reels">Reels</a>
            <a href="#moments">Moments</a>
            <a href="#models">Models</a>
            <a href="#companies">Companies</a>
            <a href="#you">Your Nexora</a>
          </div>
          <a className="back-top" href="#top">Back to top ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NEXORA. A clearer view of what’s next.</span>
          <span>MADE FOR THE CURIOUS <i /></span>
        </div>
      </footer>
    </main>
  );
}