'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Sparkles, RefreshCw, Trophy, Zap, ThumbsUp } from 'lucide-react';
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

  // Background pre-fetched next pair for sub-100ms instant transitions
  const nextPairRef = useRef<[PostWithUser, PostWithUser] | null>(null);

  const prefetchNextPair = async () => {
    try {
      const nextData = await getRandomPair();
      if (nextData) {
        nextPairRef.current = nextData;
        // Pre-load images into browser memory cache
        const img1 = new Image();
        img1.src = nextData[0].imageUrl;
        const img2 = new Image();
        img2.src = nextData[1].imageUrl;
      }
    } catch (err) {
      console.error('Failed to pre-fetch next pair:', err);
    }
  };

  const fetchPair = async (isInitial = false) => {
    if (isInitial) setLoading(true);

    if (nextPairRef.current) {
      setPair(nextPairRef.current);
      nextPairRef.current = null;
      setLoading(false);
      // Pre-fetch the following pair immediately
      prefetchNextPair();
    } else {
      try {
        const data = await getRandomPair();
        setPair(data);
        prefetchNextPair();
      } catch (err) {
        console.error('Failed to load battle pair:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPair(true);
  }, []);

  const handleVote = async (winnerId: string, loserId: string) => {
    if (votingId || !pair) return;

    setVotingId(winnerId);

    // Optimistic UI update
    const winnerPost = pair.find((p) => p.id === winnerId);
    const loserPost = pair.find((p) => p.id === loserId);

    if (winnerPost && loserPost) {
      // Optimistic Elo adjustment
      const estimatedWinnerElo = winnerPost.eloRating + 16;
      const estimatedLoserElo = Math.max(100, loserPost.eloRating - 16);

      setRecentResult({
        winnerId,
        winnerElo: estimatedWinnerElo,
        loserElo: estimatedLoserElo,
      });
    }

    setStreak((prev) => prev + 1);

    // Trigger server action in background
    castVote(winnerId, loserId).then((res) => {
      if (res.success) {
        setRecentResult((prev) =>
          prev
            ? {
                ...prev,
                winnerElo: res.winnerElo,
                loserElo: res.loserElo,
              }
            : null
        );
      }
    });

    // Instant smooth transition to next pre-fetched pair
    setTimeout(() => {
      setVotingId(null);
      setRecentResult(null);
      fetchPair();
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-4 neon-glow-fuchsia">
          <Flame className="w-4 h-4 text-fuchsia-400 animate-pulse" />
          <span>1v1 FACE-OFF ARENA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          WHICH VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400">CLEARS?</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-medium">
          Tap your favorite fit to vote. Winning updates live Elo ratings instantly!
        </p>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 inline-flex items-center gap-2 glass-panel border border-amber-500/40 px-5 py-2 rounded-full text-xs font-black text-amber-400 shadow-xl neon-glow-gold"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>VOTE STREAK: {streak} BATTLES</span>
          </motion.div>
        )}
      </div>

      {/* Main Battle Section */}
      {loading && !pair ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 glass-panel rounded-3xl border border-white/10">
          <RefreshCw className="w-10 h-10 text-fuchsia-500 animate-spin" />
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Summoning Next Matchup...
          </p>
        </div>
      ) : !pair ? (
        <div className="h-96 flex flex-col items-center justify-center text-center p-8 glass-panel rounded-3xl border border-white/10">
          <Trophy className="w-14 h-14 text-zinc-600 mb-4" />
          <h3 className="text-xl font-black text-white">Not enough posts for a battle!</h3>
          <p className="text-sm text-zinc-400 max-w-md mt-2 font-medium">
            Upload at least 2 fits using the &quot;Post Vibe&quot; button in the navbar to start face-offs.
          </p>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Glowing Central VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 rounded-full blur-md opacity-80 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-zinc-950 border-2 border-white/20 shadow-2xl flex items-center justify-center">
                <Swords className="w-7 h-7 text-fuchsia-400" />
              </div>
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
                  initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => handleVote(post.id, otherPost.id)}
                  className={`group relative cursor-pointer rounded-3xl overflow-hidden glass-card transition-all duration-300 ${
                    isSelected
                      ? 'border-fuchsia-500 ring-4 ring-fuchsia-500/40 neon-glow-fuchsia'
                      : 'hover:border-fuchsia-500/60 hover:neon-glow-violet'
                  } flex flex-col justify-between`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Vibe'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-black/40" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-black/70 backdrop-blur-md border border-white/10 text-zinc-200">
                        {post.category || 'Aesthetic'}
                      </span>
                      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ELO {post.eloRating}</span>
                      </div>
                    </div>

                    {/* Victory Celebration Overlay */}
                    {recentResult && isWinner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-fuchsia-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white"
                      >
                        <motion.div
                          initial={{ rotate: -10, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1.1 }}
                          className="p-5 rounded-full bg-gradient-to-tr from-fuchsia-600 to-amber-400 border-4 border-white mb-3 shadow-2xl neon-glow-gold"
                        >
                          <Trophy className="w-12 h-12 text-black" />
                        </motion.div>
                        <span className="text-3xl font-black uppercase tracking-widest text-amber-300">
                          VICTORY!
                        </span>
                        <span className="text-xs font-extrabold text-zinc-200 mt-1 uppercase tracking-wider">
                          New Elo: {recentResult.winnerElo}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Card Bottom Panel */}
                  <div className="p-5 flex flex-col gap-3 bg-zinc-900/90 border-t border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            post.user.image ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={post.user.name || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-fuchsia-500/50 object-cover shadow-md"
                        />
                        <div>
                          <p className="text-xs font-black text-white">
                            @{post.user.username || 'creator'}
                          </p>
                          <p className="text-[11px] font-bold text-zinc-400 mt-0.5">
                            {post.wins} Wins &bull; {post.losses} Losses
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-zinc-800 text-zinc-200 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white transition-all shadow-lg flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>VOTE</span>
                      </button>
                    </div>

                    {post.caption && (
                      <p className="text-xs text-zinc-300 font-medium line-clamp-1 italic bg-white/5 p-2 rounded-xl border border-white/5">
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

      {/* Skip Button */}
      <div className="mt-10 text-center">
        <button
          onClick={() => fetchPair(false)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-widest text-zinc-300 glass-panel hover:bg-white/10 hover:text-white border border-white/10 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Skip Matchup</span>
        </button>
      </div>
    </div>
  );
}
