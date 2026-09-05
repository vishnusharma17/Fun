import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { logVisit } from '@/lib/track-visit';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'VibeClash | Gen-Z Image Battle & Aesthetic Leaderboard',
  description: 'Vote on head-to-head 1v1 image battles, level up Elo ratings, and climb the vibe leaderboard.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Track site visit asynchronously in background
  logVisit().catch(() => {});

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-fuchsia-500 selection:text-white`}>
        <Navbar />
        <main className="flex-1 pb-20 md:pb-10">{children}</main>
      </body>
    </html>
  );
}
