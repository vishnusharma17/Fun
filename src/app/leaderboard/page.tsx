import React from 'react';
import { prisma } from '@/lib/prisma';
import { Trophy, Crown, Flame, Sparkles, TrendingUp } from 'lucide-react';

export const revalidate = 0; // Dynamic server page

export default async function LeaderboardPage() {
  const topPosts = await prisma.post.findMany({
    take: 20,
    orderBy: {
      eloRating: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>GLOBAL AESTHETIC STANDINGS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          THE VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400">LEADERBOARD</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
          Ranked purely by 1v1 battle Elo rating points. Top outfits wear the crown.
        </p>
      </div>

      {topPosts.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <p className="text-zinc-400 font-medium">No leaderboard entries available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topPosts.map((post, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            let badgeBg = 'bg-zinc-800 border-zinc-700 text-zinc-300';
            let cardGlow = 'border-zinc-800/80 hover:border-zinc-700';

            if (rank === 1) {
              badgeBg = 'bg-amber-400 text-black font-black border-amber-300 shadow-lg shadow-amber-500/30';
              cardGlow = 'border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 shadow-xl shadow-amber-500/10';
            } else if (rank === 2) {
              badgeBg = 'bg-slate-300 text-black font-black border-slate-200 shadow-lg shadow-slate-400/20';
              cardGlow = 'border-slate-400/40 bg-zinc-900';
            } else if (rank === 3) {
              badgeBg = 'bg-amber-700 text-amber-100 font-black border-amber-600 shadow-lg shadow-amber-700/20';
              cardGlow = 'border-amber-700/40 bg-zinc-900';
            }

            return (
              <div
                key={post.id}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 ${cardGlow}`}
              >
                {/* Left Section: Rank + Post Image + Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border shrink-0 ${badgeBg}`}
                  >
                    {rank === 1 ? (
                      <Crown className="w-5 h-5 text-black" />
                    ) : (
                      `#${rank}`
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Vibe'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Post & Creator Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {post.category || 'Aesthetic'}
                      </span>
                      {isTop3 && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-400">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          TOP TIER
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 truncate">
                      {post.caption || 'Untitled Vibe'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={
                          post.user.image ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                        }
                        alt="User"
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-xs text-zinc-400 font-medium">
                        @{post.user.username || 'creator'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Stats & Elo Badge */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                  {/* Win / Loss Record */}
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Record
                    </p>
                    <p className="text-xs font-bold text-zinc-300">
                      <span className="text-emerald-400">{post.wins}W</span> -{' '}
                      <span className="text-rose-400">{post.losses}L</span>
                    </p>
                  </div>

                  {/* Elo Score */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-violet-400">
                        Elo Score
                      </p>
                      <p className="text-base font-black text-white leading-none">
                        {post.eloRating}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
