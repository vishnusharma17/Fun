'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Sparkles, RefreshCw, Trophy, Zap } from 'lucide-react';
import { getRandomPair, castVote, PostWithUser } from '@/app/actions/battle';

export default function BattlePage() {
  const [pair, setPair] = useState<[PostWithUser, PostWithUser] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [recentResult, setRecentResult] = useState<{
    winnerId: string;
    winnerElo: number;
    loserElo: number;
  } | null>(null);

  const fetchPair = async () => {
    setLoading(true);
    try {
      const data = await getRandomPair();
      setPair(data);
    } catch (err) {
      console.error('Failed to load battle pair:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPair();
  }, []);

  const handleVote = async (winnerId: string, loserId: string) => {
    if (votingId || !pair) return;

    setVotingId(winnerId);
    const res = await castVote(winnerId, loserId);

    if (res.success) {
      setStreak((prev) => prev + 1);
      setRecentResult({
        winnerId,
        winnerElo: res.winnerElo,
        loserElo: res.loserElo,
      });

      // Brief animation pause before loading next matchup
      setTimeout(() => {
        setVotingId(null);
        setRecentResult(null);
        fetchPair();
      }, 700);
    } else {
      setVotingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
      {/* Top Banner / Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-semibold mb-3">
          <Flame className="w-4 h-4 text-fuchsia-500 animate-pulse" />
          <span>1v1 FACE-OFF ARENA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          WHICH VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400">CLEARS?</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
          Tap on your favorite outfit to cast your vote and boost its Elo rating!
        </p>

        {/* Voting streak counter */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 shadow-md"
          >
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>VOTE STREAK: {streak} BATTLES</span>
          </motion.div>
        )}
      </div>

      {/* Main Battle Canvas */}
      {loading && !pair ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 bg-zinc-900/40 rounded-3xl border border-zinc-800/80">
          <RefreshCw className="w-8 h-8 text-fuchsia-500 animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Summoning top vibes...</p>
        </div>
      ) : !pair ? (
        <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-zinc-900/40 rounded-3xl border border-zinc-800/80">
          <Trophy className="w-12 h-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white">Not enough posts for a battle!</h3>
          <p className="text-sm text-zinc-400 max-w-md mt-1">
            Please post at least 2 fits using the &quot;Post Vibe&quot; button in the navbar to start face-offs.
          </p>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* VS Divider Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-4 border-[#09090b] shadow-2xl flex items-center justify-center">
              <Swords className="w-6 h-6 text-white" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {pair.map((post, idx) => {
              const otherPost = pair[idx === 0 ? 1 : 0];
              const isWinner = recentResult?.winnerId === post.id;
              const isSelected = votingId === post.id;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleVote(post.id, otherPost.id)}
                  className={`group relative cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 ${
                    isSelected
                      ? 'border-fuchsia-500 ring-4 ring-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/40'
                      : 'border-zinc-800/80 hover:border-fuchsia-500/50 hover:shadow-xl hover:shadow-fuchsia-500/10'
                  } bg-zinc-900 flex flex-col justify-between`}
                >
                  {/* Image & Vignette Container */}
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Vibe'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200">
                        {post.category || 'Aesthetic'}
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-violet-600/80 backdrop-blur-md border border-violet-400/30 text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ELO {post.eloRating}</span>
                      </div>
                    </div>

                    {/* Voting Result Overlay */}
                    {recentResult && isWinner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-fuchsia-600/40 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                      >
                        <div className="p-4 rounded-full bg-fuchsia-500 border-2 border-white mb-2 shadow-2xl">
                          <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-widest">VICTORY!</span>
                        <span className="text-sm font-bold text-fuchsia-200 mt-1">
                          + Rating Updated
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Card Footer Details */}
                  <div className="p-5 flex flex-col gap-3 bg-zinc-900 border-t border-zinc-800/60">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={post.user.name || 'User'}
                          className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-zinc-300">
                            @{post.user.username || 'creator'}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {post.wins}W - {post.losses}L
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-800 text-zinc-200 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white transition-all shadow-md"
                      >
                        VOTE THIS
                      </button>
                    </div>

                    {post.caption && (
                      <p className="text-xs text-zinc-400 line-clamp-1 italic">
                        &quot;{post.caption}&quot;
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Skip / Next Pair Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchPair}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Skip Matchup</span>
        </button>
      </div>
    </div>
  );
}
