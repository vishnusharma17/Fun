'use client';

import React, { useEffect, useState } from 'react';
import { UserSession, getUserProfile } from '@/app/actions/auth';
import { Trophy, Flame, Image as ImageIcon, Swords, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PostData {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string | null;
  eloRating: number;
  wins: number;
  losses: number;
  createdAt: Date;
}

interface FullUserProfile {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  bio: string | null;
  posts: PostData[];
}

export default function ProfilePage() {
  const [sessionUser, setSessionUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('vibeclash_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessionUser(parsed);
        loadProfileData(parsed.username);
      } catch (e) {
        console.error('Error loading session user:', e);
        setLoading(false);
      }
    } else {
      // Fallback demo user
      loadProfileData('kai_vibe');
    }
  }, []);

  const loadProfileData = async (username: string) => {
    setLoading(true);
    const data = await getUserProfile(username);
    if (data) {
      setProfile(data as unknown as FullUserProfile);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider text-zinc-400">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white p-4">
        <User className="w-12 h-12 text-zinc-600 mb-3" />
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-zinc-400 text-sm mt-1 mb-4">
          Please log in to manage and view your profile.
        </p>
        <Link
          href="/battle"
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-fuchsia-600 text-white"
        >
          Return to Battle Arena
        </Link>
      </div>
    );
  }

  const totalWins = profile.posts.reduce((acc, p) => acc + p.wins, 0);
  const totalLosses = profile.posts.reduce((acc, p) => acc + p.losses, 0);
  const totalBattles = totalWins + totalLosses;
  const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;
  const highestElo = profile.posts.length > 0
    ? Math.max(...profile.posts.map((p) => p.eloRating))
    : 1200;

  return (
    <main className="min-h-screen bg-[#09090b] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-fuchsia-500 shadow-xl neon-glow-fuchsia">
                <img
                  src={
                    profile.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
                  }
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-fuchsia-600 text-white rounded-full shadow-lg">
                {profile.role}
              </span>
            </div>

            {/* User Bio Details */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {profile.name || profile.username}
                </h1>
                <span className="text-sm font-semibold text-fuchsia-400">
                  @{profile.username}
                </span>
              </div>

              <p className="text-sm text-zinc-300 max-w-xl">
                {profile.bio || 'Creating and sharing high-vibe aesthetic fits on VibeClash ⚡'}
              </p>

              {/* Stats Bar */}
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/5 text-center">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                    Uploads
                  </div>
                  <div className="text-xl font-extrabold text-white mt-0.5">
                    {profile.posts.length}
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/5 text-center">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    Top Elo
                  </div>
                  <div className="text-xl font-extrabold text-amber-400 mt-0.5">
                    {highestElo}
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/5 text-center">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    Win Rate
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    {winRate}%
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/5 text-center">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-cyan-400" />
                    Battles
                  </div>
                  <div className="text-xl font-extrabold text-cyan-400 mt-0.5">
                    {totalBattles}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span>Uploaded Fits & Battle Records</span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              Sorted by latest post
            </span>
          </div>

          {profile.posts.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-white/10 space-y-3">
              <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold">No images uploaded yet</h3>
              <p className="text-xs text-zinc-400">
                Click "Post Vibe" in the navbar to upload your first image!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.posts.map((post) => (
                <div
                  key={post.id}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-fuchsia-500/50 transition duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-950">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'User post'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-zinc-200 rounded-full border border-white/10">
                        {post.category}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-fuchsia-600 text-white rounded-full shadow-lg">
                      {post.eloRating} ELO
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium text-zinc-200 line-clamp-2">
                      {post.caption || 'Fit Vibe'}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-semibold text-zinc-400">
                      <span className="text-emerald-400">
                        {post.wins} Wins
                      </span>
                      <span className="text-red-400">
                        {post.losses} Losses
                      </span>
                      <span className="text-zinc-500">
                        {post.wins + post.losses > 0
                          ? `${Math.round(
                              (post.wins / (post.wins + post.losses)) * 100
                            )}% WR`
                          : '0% WR'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
