"use client";

import { useEffect, useMemo, useState } from "react";

// ============================================================================
// TYPES - Enhanced for Social Creator Experience
// ============================================================================

type Story = {
  id: number;
  category: string;
  title: string;
  dek: string;
  time: string;
  label: string;
  image: string;
  video?: string;
  duration?: string;
  excitement?: number;
  creator?: Creator;
  likes?: number;
  shares?: number;
  comments?: number;
  // Social engagement
};

type Creator = {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  platform: "youtube" | "tiktok" | "instagram";
  videoUrl: string;     // Direct video URL for reels
  youtubeId?: string;   // For YouTube embed
  tiktokId?: string;    // For TikTok embed
};

type Comment = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  replies?: Comment[];
};

// ============================================================================
// SOCIAL CONTENT HUB - Real AI Creator Reels
// ============================================================================

const CREATOR_MEDIA = {
  // YouTube creators with AI content
  deepmind: {
    name: "DeepMind",
    handle: "@deepmind",
    avatar: "https://avatars.githubusercontent.com/DeepMind",
    verified: true,
    platform: "youtube" as const,
    youtubeId: "dQw4w9WgXcQ", // Placeholder - use actual AI videos
    videoUrl: "https://storage.googleapis.com/media.giphy.com/media/Jix6n2pK6Y5mU7h0dL/giphy.gif",
  },
  anthropic: {
    name: "Anthropic",
    handle: "@anthropicai",
    avatar: "https://avatars.githubusercontent.com/AnthropicAI",
    verified: true,
    platform: "instagram" as const,
    videoUrl: "https://assets.pinterest.com/ext/interest_glyph.png",
  },
  openai: {
    name: "OpenAI",
    handle: "@openai",
    avatar: "https://avatars.githubusercontent.com/OpenAI",
    verified: true,
    platform: "tiktok" as const,
    videoUrl: "https://assets.pinterest.com/ext/interest_glyph.png",
  },
};

// ============================================================================
// SOCIAL REELS DATA
// ============================================================================

const SOCIAL_REELS: Story[] = [
  {
    id: 101,
    category: "CREATOR REEL",
    title: "The New Reasoning Era - Explained in 60 Seconds",
    dek: "How AI agents are getting smarter at planning, checking, and revising their own work before responding.",
    time: "01:02",
    label: "Reasoning",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop",
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "01:02",
    excitement: 10,
    creator: { ...CREATOR_MEDIA.deepmind, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
    likes: 1247,
    shares: 342,
    comments: 89,
  },
  {
    id: 102,
    category: "CREATOR REEL",
    title: "Multi-Modal AI Magic - Seeing & Speaking Together",
    dek: "Models that understand images, audio, and text all at once. The future is already here.",
    time: "00:48",
    label: "Multimodal",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
    video: `https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4`,
    duration: "00:48",
    excitement: 9,
    creator: { ...CREATOR_MEDIA.openai, videoUrl: "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4" },
    likes: 2103,
    shares: 567,
    comments: 145,
  },
  {
    id: 103,
    category: "CREATOR REEL",
    title: "AI Agents That Browse Your Web - Mind Blown 🤯",
    dek: "Meet the first AI agents that can click, type, and research on your behalf while you sleep.",
    time: "00:55",
    label: "Agents",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop",
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "00:55",
    excitement: 10,
    creator: { ...CREATOR_MEDIA.anthropic, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
    likes: 3451,
    shares: 891,
    comments: 234,
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

function PlayButton() {
  return (
    <div className="play-overlay" aria-hidden="true">
      <div className="play-button">
        <span className="play-icon">▶</span>
      </div>
    </div>
  );
}

// Like button component
function LikeButton({ count, liked = false }: { count: number; liked?: boolean }) {
  const [isLiked, setIsLiked] = useState(liked);
  const [count2, setCount2] = useState(count);

  return (
    <button
      className={`like-btn ${isLiked ? "liked" : ""}`}
      onClick={() => {
        setCount2(isLiked ? count2 - 1 : count2 + 1);
        setIsLiked(!isLiked);
      }}
      aria-label={isLiked ? "Unlike" : "Like"}
      aria-pressed={isLiked}
    >
      <span className={`heart ${isLiked ? "filled" : ""}`}>❤</span>
      <span className="like-count">{count2.toLocaleString()}</span>
    </button>
  );
}

// Share button component
function ShareButton({ storyId }: { storyId: number }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Reel on Nexora",
          url: `https://nexora-news-nu.vercel.app/stories/${storyId}`,
        });
      } catch (e) { /* ignore */ }
    } else {
      navigator.clipboard.writeText(`https://nexora-news-nu.vercel.app/stories/${storyId}`);
    }
  };

  return (
    <button className="share-btn" onClick={handleShare} aria-label="Share">
      <span>↗</span>
      <span className="share-count">0</span>
    </button>
  );
}

// Comments section
function CommentsSection({ count }: { count: number }) {
  return (
    <button className="comment-btn" aria-label={`${count} comments`}>
      <span>💬</span>
      <span className="comment-count">{count}</span>
    </button>
  );
}

// ============================================================================
// HOME PAGE
// ============================================================================

export default function Home() {
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [followed, setFollowed] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("nexora:visits");
    const visits = stored ? JSON.parse(stored) : [];

    if (!visits.includes(today)) {
      visits.push(today);
      localStorage.setItem("nexora:visits", JSON.stringify(visits));
    }

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

  const filteredReels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return SOCIAL_REELS;
    return SOCIAL_REELS.filter(s =>
      `${s.title} ${s.dek} ${s.category}`.toLowerCase().includes(needle)
    );
  }, [query]);

  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  function toggleSaved(id: number) {
    setSaved(items => (items.includes(id) ? items.filter(i => i !== id) : [...items, id]));
  }

  const stories: Story[] = [
    {
      id: 1,
      category: "THE BIG PICTURE",
      title: "Open-Source AI Just Changed Everything",
      dek: "The next chapter of AI is being written in the open—models moving from experiment to essential infrastructure for everyone building tomorrow.",
      time: "8 min read",
      label: "Open models",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
      excitement: 9,
    },
    // More stories...
  ];

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Header with Social Features */}
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
            <a href="#news">News</a>
            <a href="#reels">Reels</a>
            <a href="#creators">Creators</a>
            <a href="#moments">Moments</a>
            <a href="#models">Models</a>
            <a href="#companies">Companies</a>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-button"
              type="button"
              aria-label={searchOpen ? "Close search" : "Search Nexora"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(o => !o)}
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
              onClick={() => setDark(v => !v)}
            >
              {dark ? "☀️" : "🌙"}
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
                onChange={e => setQuery(e.target.value)}
                placeholder="Try 'AI agents' or 'reasoning'"
              />
              <kbd>ESC</kbd>
            </div>
          </div>
        )}
      </header>

      {/* Today Strip */}
      <section className="today-strip" aria-label="Today on Nexora">
        <div className="today-label">
          <span className="live-dot" />TODAY ON NEXORA
        </div>
        <p>AI is moving quickly. <span>Understanding it can feel effortless.</span></p>
        <a href="#reels" aria-label="Watch reels">
          <Arrow />
        </a>
      </section>

      {/* Hero */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />AI that moves fast. Content that feels right.
          </p>
          <h1 id="hero-title">The future of AI.<br /><span>Beautifully understood.</span></h1>
          <p className="hero-dek">
            Curated AI news, creator reels, community discussions — all in one addictive feed.
          </p>
          <div className="hero-ctas">
            <a className="button button-dark" href="#reels">
              Watch creator reels <Arrow />
            </a>
            <a className="text-link" href="#about">About Nexora <span>↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb-scene">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="orb-glow" />
            <div className="hero-orb">
              <div className="orb-shine" />
              <div className="orb-core" />
            </div>
            <span className="orb-label orb-label-one"><i /> Content, connected</span>
            <span className="orb-label orb-label-two">AI, made social</span>
            <span className="orb-index">01 <span> / </span> 06</span>
          </div>
        </div>
      </section>

      {/* Creator Reels Section - SOCIAL HUB */}
      <section className="reels-section section-wrap" id="reels" aria-labelledby="reels-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-eyebrow">CREATOR REELS</p>
            <h2 id="reels-title">AI content that's going viral 🎥</h2>
            <p className="section-intro">
              From DeepMind, OpenAI, Anthropic and more. Like, comment, share — just like Instagram.
            </p>
          </div>
        </div>

        <div className="reels-grid" aria-live="polite">
          {filteredReels.map((reel, index) => (
            <article className="reel-card" key={reel.id}>
              {/* Creator header */}
              <div className="reel-creator">
                <span className="creator-badge" aria-label={`${reel.creator?.name}, ${reel.creator?.platform === "youtube" ? "YouTube" : reel.creator?.platform === "tiktok" ? "TikTok" : "Instagram"}`}>
                  <img src={reel.creator?.avatar} alt="" className="creator-avatar" />
                  <span className="creator-name">{reel.creator?.name}</span>
                  {reel.creator?.verified && <span className="verified-badge">✓</span>}
                </span>
              </div>

              {/* Reel artwork */}
              <a
                className="reel-art"
                href={reel.video}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${reel.title}`}
              >
                <div className="reel-overlay">
                  <PlayButton />
                  <div className="reel-info">
                    <span className="reel-category">{reel.category}</span>
                    <span className="reel-duration">{reel.time}</span>
                  </div>
                </div>
                <img src={reel.image} alt={reel.title} loading="lazy" />
                <div className="reel-gradient" />
              </a>

              {/* Reel caption */}
              <div className="reel-caption">
                <h3>{reel.title}</h3>
                <p className="reel-dek">{reel.dek}</p>
              </div>

              {/* Social actions - Instagram/TikTok style */}
              <div className="reel-actions">
                <div className="action-left">
                  <LikeButton count={reel.likes || 0} />
                  <CommentsSection count={reel.comments || 0} />
                </div>
                <ShareButton storyId={reel.id} />
              </div>

              {/* Comments preview */}
              <div className="comments-preview">
                <div className="comments-count">
                  {reel.comments} comments • {reel.shares} shares
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick add for creators to claim their content */}
      <section className="creator-hub section-wrap" id="creators" aria-labelledby="creators-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-eyebrow">FOR CREATORS</p>
            <h2 id="creators-title">Get your AI content featured</h2>
            <p className="section-intro">
              Submit your AI explainers, deep dives, and thought pieces. We curate the best for our community.
            </p>
          </div>
        </div>
        <div className="creator-guidelines">
          <a className="button button-light" href="#about">
            Submission Guidelines <Arrow />
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="newsletter-inner">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />A Clearer Start</p>
            <h2 id="newsletter-title">Your daily AI briefing, <em>curated</em>.</h2>
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
                onChange={e => setEmail(e.target.value)}
                disabled={subscribed}
              />
              <button type="submit" disabled={subscribed}>
                {subscribed ? "You're on the list ✓" : "Join the briefing"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <a className="wordmark footer-wordmark" href="#top">
            <span className="wordmark-orb" />NEXORA
          </a>
          <p>Understand what's next.</p>
          <div className="footer-links">
            <a href="#reels">Reels</a>
            <a href="#creators">Creators</a>
            <a href="#about">About</a>
          </div>
          <a className="back-top" href="#top">Back to top ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NEXORA. A clearer view of what's next.</span>
        </div>
      </footer>
    </main>
  );
}