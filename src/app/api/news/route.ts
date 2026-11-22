import { NextResponse } from "next/server";

// ============================================================================
// Nexora Live AI News API - Social Creator Edition
// Returns curated AI news stories with social engagement data
// ============================================================================

type NewsSource = { name: string; url: string };

type Creator = {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  platform: "youtube" | "tiktok" | "instagram";
  youtubeId?: string;
  tiktokId?: string;
};

type NewsStory = {
  id: number;
  category: string;
  title: string;
  dek: string;
  time: string;
  label: string;
  image: string;
  video?: string;
  duration?: string;
  excitement: number;
  likes?: number;
  shares?: number;
  comments?: number;
  sources?: NewsSource[];
  creator?: Creator;
  platformTag?: "news" | "reel" | "live";
};

const IMAGES = {
  open: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
  reason: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop",
  know: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
  nvidia: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop",
  agents: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop",
  multimodal: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
  deepmind: "https://images.unsplash.com/photo-1581092795353-4d23d46a253a?w=800&q=80&auto=format&fit=crop",
  anthropic: "https://images.unsplash.com/photo-151938995047-d4e981ebb37f?w=800&q=80&auto=format&fit=crop",
  openai: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop",
  gemini: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80&auto=format&fit=crop",
};

// Social engagement metrics (simulated)
const ENGAGEMENT = {
  1: { likes: 1247, shares: 342, comments: 89 },
  2: { likes: 3451, shares: 891, comments: 234 },
  3: { likes: 892, shares: 156, comments: 67 },
  4: { likes: 1876, shares: 423, comments: 145 },
  5: { likes: 2103, shares: 567, comments: 145 },
  6: { likes: 1567, shares: 389, comments: 112 },
  101: { likes: 1247, shares: 342, comments: 89 },
  102: { likes: 2103, shares: 567, comments: 145 },
  103: { likes: 3451, shares: 891, comments: 234 },
  104: { likes: 987, shares: 234, comments: 78 },
  105: { likes: 1567, shares: 389, comments: 112 },
  106: { likes: 2345, shares: 678, comments: 189 },
};

// Creator profiles for reels
const CREATORS: Record<string, Creator> = {
  deepmind: {
    name: "DeepMind",
    handle: "@deepmind",
    avatar: "https://avatars.githubusercontent.com/DeepMind",
    verified: true,
    platform: "youtube",
    youtubeId: "deepmind-videos",
  },
  anthropic: {
    name: "Anthropic",
    handle: "@anthropicai",
    avatar: "https://avatars.githubusercontent.com/AnthropicAI",
    verified: true,
    platform: "instagram",
  },
  openai: {
    name: "OpenAI",
    handle: "@openai",
    avatar: "https://avatars.githubusercontent.com/OpenAI",
    verified: true,
    platform: "tiktok",
  },
  gemini: {
    name: "Google Gemini",
    handle: "@googlegemini",
    avatar: "https://avatars.githubusercontent.com/Google ",
    verified: true,
    platform: "youtube",
    youtubeId: "gemini-today",
  },
};

// Main AI News Stories
const NEWS_STORIES: NewsStory[] = [
  {
    id: 1,
    category: "THE BIG PICTURE",
    title: "Open-Source AI Just Changed Everything",
    dek: "The next chapter of AI is being written in the open—models moving from experiment to essential infrastructure for everyone building tomorrow.",
    time: "8 min read",
    label: "Open models",
    image: IMAGES.open,
    excitement: 9,
    sources: [
      { name: "OpenAI", url: "https://openai.com" },
      { name: "Anthropic", url: "https://anthropic.com" },
    ],
    platformTag: "news",
  },
  {
    id: 2,
    category: "FRONTIER WATCH",
    title: "Reasoning Models Can Now Plan Their Own Work",
    dek: "A new kind of reasoning takes shape—systems that can think, check, and revise before they answer, like a chess master seeing ten moves ahead.",
    time: "6 min read",
    label: "Reasoning",
    image: IMAGES.reason,
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "01:34",
    excitement: 10,
    sources: [{ name: "OpenAI", url: "https://openai.com/research" }],
    platformTag: "reel",
    creator: CREATORS.deepmind,
  },
  {
    id: 3,
    category: "AI, EXPLAINED",
    title: "What Does an AI Model Actually Know?",
    dek: "Inside memorizing vs predicting vs understanding—why the distinction matters more than you think.",
    time: "5 min read",
    label: "Fundamentals",
    image: IMAGES.know,
    excitement: 7,
    sources: [{ name: "Anthropic", url: "https://www.anthropic.com" }],
    platformTag: "news",
  },
  {
    id: 4,
    category: "THE BIG PICTURE",
    title: "NVIDIA's Blackwell Chips Arrive—And They're Fast",
    dek: "The new Blackwell architecture doesn't just train models faster. It redefines what's possible in real-time inference.",
    time: "7 min read",
    label: "Hardware",
    image: IMAGES.nvidia,
    excitement: 8,
    sources: [{ name: "NVIDIA", url: "https://www.nvidia.com" }],
    platformTag: "news",
  },
  {
    id: 5,
    category: "FRONTIER WATCH",
    title: "AI Agents That Browse the Web for You",
    dek: "Meet the first agents that can click, type, and research on your behalf while you sleep.",
    time: "4 min read",
    label: "Agents",
    image: IMAGES.agents,
    video: `https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4`,
    duration: "00:58",
    excitement: 9,
    sources: [{ name: "Microsoft", url: "https://www.microsoft.com/en-us/ai" }],
    platformTag: "reel",
    creator: CREATORS.openai,
  },
  {
    id: 6,
    category: "AI, EXPLAINED",
    title: "Multimodal Models See, Hear, and Speak",
    dek: "Text is old news. The frontier models now understand images, audio, and video natively.",
    time: "6 min read",
    label: "Multimodal",
    image: IMAGES.multimodal,
    excitement: 8,
    sources: [{ name: "Google", url: "https://ai.google" }],
    platformTag: "news",
  },
];

// Creator Reels - Social Hub
const CREATOR_REELS: NewsStory[] = [
  {
    id: 101,
    category: "CREATOR REEL",
    title: "The New Reasoning Era - Explained in 60 Seconds",
    dek: "How AI agents are getting smarter at planning, checking, and revising their own work before responding.",
    time: "01:02",
    label: "Reasoning",
    image: IMAGES.reason,
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "01:02",
    excitement: 10,
    likes: ENGAGEMENT[101].likes,
    shares: ENGAGEMENT[101].shares,
    comments: ENGAGEMENT[101].comments,
    creator: CREATORS.deepmind,
    platformTag: "reel",
  },
  {
    id: 102,
    category: "CREATOR REEL",
    title: "Multi-Modal AI Magic - Seeing & Speaking Together",
    dek: "Models that understand images, audio, and text all at once. The future is already here.",
    time: "00:48",
    label: "Multimodal",
    image: IMAGES.multimodal,
    video: `https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4`,
    duration: "00:48",
    excitement: 9,
    likes: ENGAGEMENT[102].likes,
    shares: ENGAGEMENT[102].shares,
    comments: ENGAGEMENT[102].comments,
    creator: CREATORS.openai,
    platformTag: "reel",
  },
  {
    id: 103,
    category: "CREATOR REEL",
    title: "AI Agents That Browse Your Web - Mind Blown 🤯",
    dek: "Meet the first AI agents that can click, type, and research on your behalf while you sleep.",
    time: "00:55",
    label: "Agents",
    image: IMAGES.agents,
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "00:55",
    excitement: 10,
    likes: ENGAGEMENT[103].likes,
    shares: ENGAGEMENT[103].shares,
    comments: ENGAGEMENT[103].comments,
    creator: CREATORS.anthropic,
    platformTag: "reel",
  },
  {
    id: 104,
    category: "CREATOR REEL",
    title: "Gemini 2.0 Flash - Speed Test by Tech Reviewers",
    dek: "How fast is Google's newest model? We put it through the wringer with real coding tasks.",
    time: "01:23",
    label: "Gemini",
    image: IMAGES.gemini,
    video: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    duration: "01:23",
    excitement: 8,
    likes: ENGAGEMENT[104].likes,
    shares: ENGAGEMENT[104].shares,
    comments: ENGAGEMENT[104].comments,
    creator: CREATORS.gemini,
    platformTag: "reel",
  },
];

const LIVE_STORIES = [...NEWS_STORIES, ...CREATOR_REELS].sort((a, b) => b.excitement - a.excitement);

// Social comments data (simulated)
const COMMENTS_DATA = {
  101: [
    { id: 1, author: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=1", content: "This is exactly what I've been waiting for! 🔥", likes: 23, time: "2h ago" },
    { id: 2, author: "Maya Chen", avatar: "https://i.pravatar.cc/150?img=2", content: "The planning aspect changes everything for coding assistants", likes: 18, time: "4h ago" },
  ],
  102: [
    { id: 1, author: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=3", content: "Finally seeing the future of multimodal AI!", likes: 45, time: "1h ago" },
  ],
  103: { 103: [] },
};

// =============================================================
export async function GET() {
  const stories = LIVE_STORIES.map(s => ({
    ...s,
    engagement: {
      likes: s.likes || 0,
      shares: s.shares || 0,
      comments: s.comments || 0,
    },
    comments: COMMENTS_DATA[s.id as keyof typeof COMMENTS_DATA] || [],
  }));

  return NextResponse.json({
    stories,
    categories: ["News", "Reels", "Live", "Trending"],
    creators: Object.values(CREATORS),
    generatedAt: new Date().toISOString(),
    socialMetrics: {
      totalLikes: Object.values(ENGAGEMENT).reduce((a, b) => a + b.likes, 0),
      totalShares: Object.values(ENGAGEMENT).reduce((a, b) => a + b.shares, 0),
      totalComments: Object.values(ENGAGEMENT).reduce((a, b) => a + b.comments, 0),
    },
  });
}

// =============================================================
export async function POST(req: Request) {
  const { action, storyId, type } = await req.json();

  switch (action) {
    case "like":
      // In production: update DB, send notification
      return NextResponse.json({ success: true, message: "Liked!" });
    case "comment":
      // In production: add comment, notify creator
      return NextResponse.json({ success: true, message: "Comment added!" });
    case "share":
      // In production: track share, maybe offer incentive
      return NextResponse.json({ success: true, shares: (type === "instagram" ? 1.2 : type === "tiktok" ? 1.5 : 1) });
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}