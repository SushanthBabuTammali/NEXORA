import { NextResponse } from "next/server";

// ============================================================================
// Nexora Live AI News API
// Returns curated, exciting AI news stories with images & sources.
// ============================================================================

type NewsSource = { name: string; url: string };

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
  sources?: NewsSource[];
};

const IMAGES = {
  open: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
  reason: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format&fit=crop",
  know: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
  nvidia: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop",
  agents: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop",
  multimodal: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
};

const REELS = [
  {
    id: 2,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: "01:34",
  },
  {
    id: 5,
    video: "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
    duration: "00:58",
  },
];

export async function GET() {
  // In production this would call an AI curation pipeline / RSS feeds.
  // For now we serve today's live exciting news set.
  const stories: NewsStory[] = [
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
    },
    {
      id: 2,
      category: "FRONTIER WATCH",
      title: "Reasoning Models Can Now Plan Their Own Work",
      dek: "A new kind of reasoning takes shape—systems that can think, check, and revise before they answer, like a chess master seeing ten moves ahead.",
      time: "6 min read",
      label: "Reasoning",
      image: IMAGES.reason,
      video: REELS[0]?.video,
      duration: REELS[0]?.duration,
      excitement: 10,
      sources: [{ name: "OpenAI", url: "https://openai.com/research" }],
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
    },
    {
      id: 4,
      category: "THE BIG PICTURE",
      title: "NVIDIA’s Blackwell Chips Arrive—And They’re Fast",
      dek: "The new Blackwell architecture doesn’t just train models faster. It redefines what’s possible in real-time inference.",
      time: "7 min read",
      label: "Hardware",
      image: IMAGES.nvidia,
      excitement: 8,
      sources: [{ name: "NVIDIA", url: "https://www.nvidia.com" }],
    },
    {
      id: 5,
      category: "FRONTIER WATCH",
      title: "AI Agents That Browse the Web for You",
      dek: "Meet the first agents that can click, type, and research on your behalf while you sleep.",
      time: "4 min read",
      label: "Agents",
      image: IMAGES.agents,
      video: REELS[1]?.video,
      duration: REELS[1]?.duration,
      excitement: 9,
      sources: [{ name: "Microsoft", url: "https://www.microsoft.com/en-us/ai" }],
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
    },
  ];

  // Sort by excitement so the most exciting stories come first
  const sorted = [...stories].sort((a, b) => b.excitement - a.excitement);

  return NextResponse.json({ stories: sorted, generatedAt: new Date().toISOString() });
}
