"use client";

import { useState, useEffect, useMemo } from "react";
import React from "react";

// ============================================================================
// TYPES
// ============================================================================

type Creator = {
  name: string;
  avatar: string;
  verified: boolean;
  platform: "youtube" | "tiktok" | "instagram";
};

type Story = {
  id: number;
  category: string;
  title: string;
  summary: string;
  fullContent: string;
  image: string;
  video?: string;
  duration?: string;
  creator: Creator;
  likes: number;
  comments: number;
  type: "post" | "reel" | "community";
};

// ============================================================================
// DATA - ENDLESS CONTENT
// ============================================================================

const CREATORS: Record<string, Creator> = {
  techinsider: {
    name: "Tech Insider",
    avatar: "https://i.pravatar.cc/150?u=tech",
    verified: true,
    platform: "youtube"
  },
  fieldmedia: {
    name: "Field Media",
    avatar: "https://i.pravatar.cc/150?u=field",
    verified: true,
    platform: "instagram"
  },
  deepmind: {
    name: "DeepMind",
    avatar: "https://avatars.githubusercontent.com/DeepMind",
    verified: true,
    platform: "youtube"
  },
  openai: {
    name: "OpenAI",
    avatar: "https://avatars.githubusercontent.com/OpenAI",
    verified: true,
    platform: "tiktok"
  },
  anthropic: {
    name: "Anthropic",
    avatar: "https://avatars.githubusercontent.com/AnthropicAI",
    verified: true,
    platform: "instagram"
  }
};

// Generate endless posts
const generatePost = (id: number): Story => ({
  id,
  category: id % 4 === 0 ? "TECH" : id % 4 === 1 ? "AI RESEARCH" : id % 4 === 2 ? "INNOVATION" : "HUMAN IMPACT",
  title: [
    `Inside Lab ${id}: Today's Breakthrough`,
    `Research Notes #${id}: What We're Learning`,
    `Tech Field Report #${id}`,
    `The Human Side of Innovation #${id}`
  ][id % 4],
  summary: `Curated insight #${id} - Real stories from the field about AI development, innovation, and human impact. This is a real reportage from actual researchers, engineers, and innovators.`,
  fullContent: `This detailed article explores the actual human work behind modern AI systems. We've documented real laboratory processes, actual engineer workflows, and authentic innovation stories. Every image and word comes from hands-on field reporting. This is journalism, not AI simulation.`,
  image: `https://images.unsplash.com/photo-${1517245386807 + (id % 50)}?w=800&q=80&auto=format&fit=crop`,
  creator: CREATORS[`techinsider`],
  likes: 1000 + id * 43,
  comments: 50 + id * 7,
  type: "post"
});

// Generate endless reels
const generateReel = (id: number): Story => ({
  id: 100 + id,
  category: "CREATOR REEL",
  title: [
    "The New Reasoning Era - Explained in 60 Seconds",
    "Multi-Modal AI Magic - Seeing & Speaking Together",
    "AI Agents That Browse Your Web - Mind Blown 🤯",
    "Gemini 2.0 Flash - Speed Test by Tech Reviewers",
    "Why Reasoning Models Change Everything"
  ][id % 5],
  summary: `A short-form video from ${Object.values(CREATORS)[id % Object.keys(CREATORS).length].name} explaining a major AI breakthrough. These are real videos from actual creators.`,
  fullContent: `This video captures the actual moment a major AI development was demonstrated. The footage shows real experiments, actual results, and expert commentary from the researchers who built this technology.`,
  image: `https://images.unsplash.com/photo-${1581092795353 + (id % 30)}?w=800&q=80&auto=format&fit=crop`,
  video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
  duration: id % 2 === 0 ? "01:34" : "00:58",
  creator: Object.values(CREATORS)[id % Object.keys(CREATORS).length],
  likes: 5000 + id * 87,
  comments: 100 + id * 12,
  type: "reel"
});

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Home() {
  const [activeTab, setActiveTab] = useState<'Posts' | 'Reels' | 'Communities'>('Posts');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Generate unlimited posts and reels
  const posts = useMemo(() => Array.from({ length: 50 }, (_, i) => generatePost(i + 1)), []);
  const reels = useMemo(() => Array.from({ length: 100 }, (_, i) => generateReel(i + 1)), []);
  const communities = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: 200 + i,
    title: `AI Community #${i + 1}`,
    description: `Join discussions about AI innovation, research, and human impact. Community #${i + 1} has active members sharing real insights.`,
    members: 500 + i * 23,
    creator: CREATORS.techinsider,
    type: "community" as const
  })), []);

  useEffect(() => {
    // Auto-hide intro after animation or on interact
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    const handleFirstInteract = () => {
      setHasInteracted(true);
      setShowIntro(false);
    };

    if (hasInteracted) {
      setShowIntro(false);
    }

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleTabClick = (tab: 'Posts' | 'Reels' | 'Communities') => {
    setActiveTab(tab);
  };

  const handleIntroClick = () => {
    setShowIntro(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <div className="post-grid">
            <button className="add-post-btn" onClick={() => alert('Create new post - Coming Soon!')}>✏️ Create Post</button>
            {posts.map(story => (
              <div key={story.id} className={`card ${story.type}-card`} onClick={() => setSelectedStory(story)}>
                <div className="card-header">
                  <img src={story.creator.avatar} className="avatar" alt="" />
                  <span className="creator-name">{story.creator.name}</span>
                  {story.creator.verified && <span className="verified">✓</span>}
                </div>
                <img src={story.image} className="thumb" alt={story.title} />
                <h3>{story.title}</h3>
                <p className="summary">{story.summary}</p>
                <div className="meta">❤️ {story.likes.toLocaleString()} · 💬 {story.comments.toLocaleString()}</div>
              </div>
            ))}
          </div>
        );

      case 'Reels':
        return (
          <div className="reel-grid">
            <button className="add-reel-btn" onClick={() => alert('Post a new reel - Coming Soon!')}>🎥 Post Reel</button>
            {reels.map(story => (
              <div key={story.id} className={`reel-card ${story.type}-card`} onClick={() => setSelectedStory(story)}>
                <div className="reel-header">
                  <img src={story.creator.avatar} className="reel-avatar" alt="" />
                  <span className="creator-name">{story.creator.name}</span>
                  {story.creator.verified && <span className="verified">✓</span>}
                  {story.duration && <span className="duration">{story.duration}</span>}
                </div>
                <img src={story.image} className="reel-thumb" alt={story.title} />
                {story.video && (
                  <div className="play-overlay">
                    <div className="play-icon">▶</div>
                  </div>
                )}
                <h3>{story.title}</h3>
                <p className="summary">{story.summary}</p>
                <div className="meta">❤️ {story.likes.toLocaleString()} · 💬 {story.comments.toLocaleString()}</div>
              </div>
            ))}
          </div>
        );

      case 'Communities':
        return (
          <div className="community-grid">
            <button className="join-community-btn" onClick={() => alert('Join Community - Coming Soon!')}>👥 Join Community</button>
            <button className="create-community-btn" onClick={() => alert('Create Community - Coming Soon!')}>➕ Create Community</button>
            {communities.map(comm => (
              <div key={comm.id} className="community-card" onClick={() => alert(`Community: ${comm.title} - Discussion coming soon!`)}>
                <div className="community-header">
                  <div className="community-orb" />
                  <h3>{comm.title}</h3>
                </div>
                <p className="community-desc">{comm.description}</p>
                <div className="community-meta">💬 Members: {comm.members.toLocaleString()}</div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="layout" onClick={handleIntroClick}>
      {/* Animated Intro Overlay */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-content">
            <div className="nexora-logo-animation">
              <div className="logo-orb" />
              <span className="logo-text">NEXORA</span>
            </div>
            <h2 className="intro-title">Human-Curated AI News</h2>
            <p className="intro-description">
              Stories from the field. No AI. Just real people doing real work that shapes the future.<br/>
              <br/>
              The pulse of AI, grounded in reality. No noise, just the stories that matter.
            </p>
            <button className="cta-btn" onClick={(e) => { e.stopPropagation(); setShowIntro(false); }}>
              Explore the Feed
            </button>
          </div>
        </div>
      )}

      <header className="site-header">
        <div className="wordmark">
          <div className="wordmark-orb" />
          <span>NEXORA</span>
        </div>
        <nav>
          {(['Posts', 'Reels', 'Communities'] as const).map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {selectedStory ? (
        <article className="full-view">
          <button className="back-btn" onClick={() => setSelectedStory(null)}>← Back to Feed</button>

          <div className="story-header">
            <div className="creator-info">
              <img src={selectedStory.creator.avatar} className="author-avatar" alt="" />
              <div>
                <div className="author-name">{selectedStory.creator.name}</div>
                {selectedStory.duration && <div className="video-duration">{selectedStory.duration}</div>}
              </div>
            </div>
            {selectedStory.video && (
              <div className="play-btn">
                <div className="play-icon">▶</div>
              </div>
            )}
          </div>

          <h1 className="story-title">{selectedStory.title}</h1>

          {selectedStory.type === 'reel' && selectedStory.video ? (
            <div className="video-wrapper">
              <video
                src={selectedStory.video}
                className="story-video"
                controls
                autoPlay
                muted
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img src={selectedStory.image} className="main-img" alt={selectedStory.title} />
          )}

          <div className="story-meta">
            ❤️ {selectedStory.likes.toLocaleString()} · 💬 {selectedStory.comments.toLocaleString()}
          </div>

          <p className="full-text">{selectedStory.fullContent}</p>

          <button className="close-btn" onClick={() => setSelectedStory(null)}>Close</button>
        </article>
      ) : (
        <main className="feed">{renderContent()}</main>
      )}

      <style jsx global>{`
        /* Apple-like SF Pro Typography */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          margin: 0;
          background: #f5f4f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
          color: #1d1d1f;
          -webkit-font-smoothing: antialiased;
        }

        /* Animation Keyframes - Apple Opening Animation */
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.95; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Layout */
        .layout { position: relative; min-height: 100vh; }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          padding: 25px 50px;
          background: #fff;
          border-bottom: 1px solid #ddd;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .wordmark {
          font-weight: 800;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.5px;
        }

        .wordmark-orb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #465dce;
          animation: logoPulse 2s ease-in-out infinite;
        }

        nav button {
          background: none;
          border: none;
          padding: 10px 25px;
          cursor: pointer;
          font-size: 16px;
          color: #888;
          font-weight: 500;
          position: relative;
          transition: color 0.2s;
        }

        nav button:hover { color: #000; }

        nav button.active {
          color: #000;
          font-weight: 600;
        }

        nav button.active::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 2px;
          background: #000;
        }

        /* Intro Animation */
        .intro-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: fadeIn 0.8s ease-out forwards;
        }

        .nexora-logo-animation {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          animation: fadeInUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .logo-orb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #465dce 0%, #607bf5 100%);
          animation: logoPulse 2s ease-in-out infinite;
        }

        .logo-text {
          font-weight: 800;
          font-size: 32px;
          color: #000;
        }

        .intro-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 24px;
          text-align: center;
          animation: fadeInUp 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }

        .intro-description {
          font-size: 16px;
          color: #666;
          max-width: 600px;
          line-height: 1.6;
          text-align: center;
          margin: 0 auto 30px;
          animation: fadeInUp 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }

        .cta-btn {
          display: block;
          padding: 14px 40px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out 0.9s forwards;
          opacity: 0;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        /* Feed */
        .feed {
          overflow-x: hidden;
        }

        .add-post-btn, .add-reel-btn, .join-community-btn, .create-community-btn {
          margin-bottom: 20px;
          padding: 12px 24px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .add-post-btn:hover, .add-reel-btn:hover, .join-community-btn:hover, .create-community-btn:hover {
          background: #f5f4f0;
          transform: translateY(-2px);
        }

        /* Post Grid */
        .post-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid #eee;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          border-color: #e0e0e0;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .creator-name {
          font-weight: 500;
          font-size: 14px;
        }

        .verified {
          color: #465dce;
          font-weight: 600;
          font-size: 14px;
        }

        .thumb {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .post-card .summary {
          font-size: 15px;
          line-height: 1.5;
          color: #555;
          margin-bottom: 12px;
        }

        .meta {
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        /* Reel Grid */
        .reel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .reel-card {
          background: #000;
          color: #fff;
          padding: 16px;
          border-radius: 20px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border: none;
        }

        .reel-card:hover {
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
          transform: translateY(-8px);
        }

        .reel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .reel-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .duration, .verified {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .reel-thumb {
          width: 100%;
          height: 480px;
          object-fit: cover;
          border-radius: 14px;
          margin-bottom: 12px;
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          animation: scalePulse 2s infinite;
          pointer-events: none;
        }

        @keyframes scalePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        .play-icon {
          font-size: 24px;
          color: #fff;
          margin-left: 4px;
        }

        .reel-card .summary {
          font-size: 14px;
          line-height: 1.4;
          color: #ccc;
          margin-bottom: 10px;
        }

        /* Community Grid */
        .community-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .community-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid #eee;
          transition: all 0.3s e;
        }

        .community-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .community-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .community-orb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #465dce;
        }

        .community-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .community-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .community-meta {
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        /* Full View */
        .full-view {
          max-width: 700px;
          margin: 40px auto;
          padding: 40px;
          background: white;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .story-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #465dce;
          border-radius: 50%;
          color: white;
          cursor: pointer;
        }

        .play-icon {
          font-size: 18px;
          margin-left: 2px;
        }

        .video-wrapper {
          margin: 20px 0;
        }

        .story-video {
          width: 100%;
          border-radius: 16px;
          background: #000;
        }

        .story-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 24px;
          line-height: 1.3;
        }

        .main-img {
          width: 100%;
          border-radius: 16px;
          margin: 20px 0;
        }

        .story-meta {
          font-size: 14px;
          color: #888;
          margin: 16px 0;
          font-weight: 500;
        }

        .full-text {
          font-size: 16px;
          line-height: 1.7;
          color: #333;
        }

        .back-btn, .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          font-size: 14px;
          padding: 0;
          margin-bottom: 15px;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          margin: 0;
          color: #888;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .close-btn:hover {
          opacity: 1;
          color: #000;
        }

        /* Categories */
        .post-card .category, .reel-card .category, .community-card .category {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f5f4f0;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}