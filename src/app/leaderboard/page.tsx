import React from 'react';
import { prisma } from '@/lib/prisma';
import { Trophy, Crown, Flame, Sparkles, TrendingUp, Percent, Swords } from 'lucide-react';

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-4 neon-glow-gold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>GLOBAL AESTHETIC STANDINGS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          THE VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400">LEADERBOARD</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-medium">
          Ranked purely by Elo rating points from 1v1 battle victories. Top fits wear the crown.
        </p>
      </div>

      {topPosts.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
          <p className="text-zinc-400 font-medium">No leaderboard entries available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topPosts.map((post, index) => {
            const rank = index + 1;
            const totalBattles = post.wins + post.losses;
            const winRate = totalBattles > 0 ? Math.round((post.wins / totalBattles) * 100) : 0;

            let badgeStyle = 'bg-zinc-800/80 text-zinc-300 border-zinc-700';
            let cardStyle = 'glass-card border-white/10 hover:border-white/20';
            let crownIcon = null;

            if (rank === 1) {
              badgeStyle = 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black border-yellow-200 neon-glow-gold';
              cardStyle = 'bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-zinc-900 border-amber-500/50 neon-glow-gold';
              crownIcon = <Crown className="w-5 h-5 text-black" />;
            } else if (rank === 2) {
              badgeStyle = 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black font-black border-white';
              cardStyle = 'bg-gradient-to-r from-slate-900/60 via-zinc-900/90 to-zinc-900 border-slate-400/50';
              crownIcon = <Crown className="w-5 h-5 text-slate-900" />;
            } else if (rank === 3) {
              badgeStyle = 'bg-gradient-to-tr from-amber-800 to-amber-600 text-amber-100 font-black border-amber-500';
              cardStyle = 'bg-gradient-to-r from-amber-950/30 via-zinc-900/90 to-zinc-900 border-amber-700/50';
              crownIcon = <Crown className="w-5 h-5 text-amber-200" />;
            }

            return (
              <div
                key={post.id}
                className={`relative rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-5 ${cardStyle}`}
              >
                {/* Left Section */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm border shrink-0 font-black shadow-lg ${badgeStyle}`}
                  >
                    {crownIcon || `#${rank}`}
                  </div>

                  {/* Image Thumbnail */}
                  <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-zinc-950 shrink-0 border border-white/10 shadow-md">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Vibe'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Creator & Caption Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/10 text-zinc-200 border border-white/10">
                        {post.category || 'Aesthetic'}
                      </span>
                      {rank <= 3 && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 tracking-wider">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          TOP TIER
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-white mt-1.5 truncate">
                      {post.caption || 'Untitled Vibe'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={
                          post.user.image ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                        }
                        alt="User"
                        className="w-4 h-4 rounded-full object-cover border border-white/20"
                      />
                      <span className="text-xs text-zinc-400 font-bold">
                        @{post.user.username || 'creator'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section Stats */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                  {/* Total Battles & Win Rate */}
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                      <Swords className="w-3 h-3 text-fuchsia-400" />
                      <span>{totalBattles} Battles</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-400 mt-0.5">
                      <Percent className="w-3 h-3" />
                      <span>{winRate}% Win Rate</span>
                    </div>
                  </div>

                  {/* Elo Score Badge */}
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300 shadow-lg">
                    <TrendingUp className="w-5 h-5 text-fuchsia-400" />
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-fuchsia-400">
                        Elo Score
                      </p>
                      <p className="text-lg font-black text-white leading-none">
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
