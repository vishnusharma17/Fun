'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeadToHeadBattleCard, BattleData } from '@/components/HeadToHeadBattleCard';
import { CreateBattleModal } from '@/components/CreateBattleModal';
import { DemoAccountSwitcher } from '@/components/DemoAccountSwitcher';
import { Flame, Plus, Sparkles, User, Zap, ChevronRight, RefreshCw, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ArenaHomeView() {
  const { currentUser } = useAuth();
  const [battles, setBattles] = useState<BattleData[]>([]);
  const [activeBattleIndex, setActiveBattleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/battles');
      if (res.ok) {
        const data = await res.json();
        setBattles(data);
      }
    } catch (err) {
      console.error('Failed to load battles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  const handleNextBattle = () => {
    if (battles.length > 0) {
      setActiveBattleIndex((prev) => (prev + 1) % battles.length);
    }
  };

  const currentBattle = battles[activeBattleIndex];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans pb-24 md:pb-12 selection:bg-pink-500 selection:text-white">
      {/* Sticky Mobile/Desktop Top Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-black font-black shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-xl font-mono leading-none bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                DRIPS<span className="text-pink-500">.</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                Gen-Z Fit Battles
              </span>
            </div>
          </Link>

          {/* Persona Switcher & Desktop Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser && (
              <Link
                href={`/u/${currentUser.username}`}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>My Drip Space</span>
              </Link>
            )}

            <Link
              href="/upload"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-full shadow-lg shadow-pink-500/20 hover:opacity-90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Drip</span>
            </Link>

            {/* Persona Switcher Dropdown */}
            <DemoAccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Gen-Z Hero Banner */}
        <div className="text-center space-y-3 py-2 sm:py-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            LIVE FIT CHECK ARENA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Which Fit Has More <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">DRIP?</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed px-2">
            Tap your vote, inspect garment tags, drop comments, and rank top style icons in the community.
          </p>
        </div>

        {/* Action Controls & Matchup Creator Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Start Custom Battle</span>
          </button>

          {battles.length > 1 && (
            <button
              onClick={handleNextBattle}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-pink-400 border border-pink-500/30 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Matchup ({activeBattleIndex + 1}/{battles.length})</span>
            </button>
          )}
        </div>

        {/* Battle Arena Display */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-xs font-mono text-neutral-400">Fetching live drip matchups...</span>
          </div>
        ) : !currentBattle ? (
          <div className="p-10 text-center rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-2xl">
            <p className="text-sm font-mono text-neutral-400">No active drip battles right now.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-full shadow-lg"
            >
              Create the First Drip Battle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <HeadToHeadBattleCard battle={currentBattle} onVoteSuccess={fetchBattles} />
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-neutral-800/80 md:hidden px-4 py-2 flex items-center justify-around">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-pink-400"
        >
          <Flame className="w-5 h-5 fill-pink-500" />
          <span>Battles</span>
        </Link>

        <Link
          href="/upload"
          className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-neutral-400 hover:text-white transition-colors"
        >
          <div className="p-2 -mt-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white shadow-lg shadow-pink-500/30">
            <Plus className="w-5 h-5" />
          </div>
          <span className="mt-1">Post Drip</span>
        </Link>

        {currentUser && (
          <Link
            href={`/u/${currentUser.username}`}
            className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        )}
      </nav>

      {/* Custom Battle Creator Modal */}
      <CreateBattleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onBattleCreated={fetchBattles}
      />
    </div>
  );
}
