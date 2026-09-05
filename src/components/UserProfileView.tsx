'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Flame, Heart, Camera, Share2, Tag, ArrowLeft, Swords } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserProfileData {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  styleTags: string;
  instagram?: string;
  photos: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    outfitTags?: string;
    views: number;
    _count: {
      likes: number;
      comments: number;
      votes: number;
    };
  }>;
  stats: {
    totalBattles: number;
    totalWins: number;
    winRate: number;
    totalLikes: number;
  };
}

export function UserProfileView({ username }: { username: string }) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold text-neutral-300">Profile Not Found</h2>
        <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs hover:text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  const tags = profile.styleTags ? profile.styleTags.split(',').map((t) => t.trim()) : [];
  const isSelf = currentUser?.id === profile.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ARENA
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800/80 p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Swords className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-neutral-700 shadow-2xl flex-shrink-0">
            <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
          </div>

          {/* User Bio & Meta */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">{profile.name}</h1>
              <span className="text-sm font-mono text-neutral-500">@{profile.username}</span>
              {isSelf && (
                <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full w-fit mx-auto md:mx-0">
                  You
                </span>
              )}
            </div>

            {profile.bio && <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">{profile.bio}</p>}

            {/* Tags & Instagram */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300"
                >
                  #{tag}
                </span>
              ))}

              {profile.instagram && (
                <a
                  href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-pink-400 hover:border-pink-500/50 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  {profile.instagram}
                </a>
              )}
            </div>
          </div>

          {/* User Arena Stats Grid */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto flex-shrink-0 border-t md:border-t-0 md:border-l border-neutral-800/80 pt-6 md:pt-0 md:pl-8">
            <div className="bg-neutral-900/60 rounded-2xl p-3 border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-bold font-mono">{profile.stats.winRate}%</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Win Rate</div>
            </div>

            <div className="bg-neutral-900/60 rounded-2xl p-3 border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-lg font-bold font-mono">{profile.stats.totalBattles}</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Battles</div>
            </div>

            <div className="bg-neutral-900/60 rounded-2xl p-3 border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-lg font-bold font-mono">{profile.stats.totalLikes}</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Style Gallery Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-neutral-400" />
            Style Gallery
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">High-quality fits and aesthetic uploads</p>
        </div>

        {isSelf && (
          <Link
            href="/upload"
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-full transition-colors"
          >
            + Upload New Fit
          </Link>
        )}
      </div>

      {/* Photos Grid */}
      {profile.photos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-950 border border-neutral-900">
          <p className="text-sm text-neutral-500 font-mono">No looks uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all shadow-xl flex flex-col"
            >
              {/* Image aspect ratio container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-300 uppercase tracking-wider border border-white/10">
                  {photo.category}
                </div>
              </div>

              {/* Fit Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-semibold text-white text-base leading-snug group-hover:text-amber-400 transition-colors">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{photo.description}</p>
                  )}
                </div>

                {photo.outfitTags && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 truncate">
                    <Tag className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{photo.outfitTags}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-400/20" /> {photo._count.likes}
                  </span>
                  <span>{photo._count.votes} battle votes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
