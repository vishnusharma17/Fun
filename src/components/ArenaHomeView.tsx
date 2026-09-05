'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeadToHeadBattleCard, BattleData } from '@/components/HeadToHeadBattleCard';
import { CreateBattleModal } from '@/components/CreateBattleModal';
import { DemoAccountSwitcher } from '@/components/DemoAccountSwitcher';
import { Swords, Plus, Sparkles, Trophy, Flame, Shield, ArrowRight, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ArenaHomeView() {
  const { currentUser } = useAuth();
  const [battles, setBattles] = useState<BattleData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      setCurrentIndex((prev) => (prev + 1) % battles.length);
    }
  };

  const currentBattle = battles[currentIndex];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white text-black font-extrabold shadow-lg">
              <Swords className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-lg font-mono leading-none text-white">
                STYLE<span className="text-amber-400">ARENA</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500">
                Head-to-Head Public Vote
              </span>
            </div>
          </Link>

          {/* Navigation & Persona Switcher */}
          <div className="flex items-center gap-4">
            {currentUser && (
              <Link
                href={`/u/${currentUser.username}`}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-neutral-400" />
                <span>My Space</span>
              </Link>
            )}

            <Link
              href="/upload"
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Fit</span>
            </Link>

            {/* Persona Switcher Dropdown */}
            <DemoAccountSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Hero Tagline */}
        <div className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Aesthetic Showdown
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Which Look Defines the Aesthetic?
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Compare high-fashion fits side-by-side. Cast your vote, explore outfit breakdowns, leave comments, and track user stats.
          </p>
        </div>

        {/* Action Controls & Matchup Creator Button */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 text-xs font-medium transition-all flex items-center gap-2"
            >
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Create Matchup Battle</span>
            </button>
          </div>

          {battles.length > 1 && (
            <button
              onClick={handleNextBattle}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold transition-all flex items-center gap-2"
            >
              <span>Next Matchup ({currentIndex + 1}/{battles.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Battle Arena Display */}
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-xs font-mono text-neutral-500">Loading live matchups...</span>
          </div>
        ) : !currentBattle ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-950 border border-neutral-900 space-y-4">
            <p className="text-sm font-mono text-neutral-400">No active comparison battles found.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-full"
            >
              Create the First Battle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <HeadToHeadBattleCard battle={currentBattle} onVoteSuccess={fetchBattles} />
          </div>
        )}
      </main>

      {/* Custom Battle Creator Modal */}
      <CreateBattleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onBattleCreated={fetchBattles}
      />
    </div>
  );
}
