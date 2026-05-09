import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Content Scheduler — Social Media Management Platform",
  description: "Schedule and automate your social media content across Facebook, Instagram, and LinkedIn. Manage all your posts from one beautiful dashboard.",
  keywords: ["social media", "scheduler", "content management", "facebook", "instagram", "linkedin", "automation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">{children}</body>
    </html>
  );
}
