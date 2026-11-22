import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora — Understand what’s next",
  description:
    "A clearer view of artificial intelligence. Explore thoughtful stories, short explainers, model profiles and the people shaping what comes next.",
  applicationName: "Nexora",
  icons: { icon: "/nexora-mark.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
