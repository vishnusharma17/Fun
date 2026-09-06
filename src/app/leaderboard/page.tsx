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

  const topPost = topPosts[0] || null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Outer Leaderboard Container Matching Drawing */}
      <div className="rounded-3xl border border-white/20 p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
        {/* Wireframe Header Row: [ image | name | rank | votes ] */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center pb-3 border-b border-white/10 text-xs sm:text-sm font-mono font-extrabold text-zinc-300 uppercase tracking-wider px-2">
          <div className="col-span-3 sm:col-span-3 text-center sm:text-left py-1 px-2 rounded-xl border border-white/10 bg-white/5">
            image
          </div>
          <div className="col-span-4 sm:col-span-4 text-center py-1 px-2 rounded-xl border border-white/10 bg-white/5">
            name
          </div>
          <div className="col-span-2 sm:col-span-2 text-center py-1 px-2 rounded-xl border border-white/10 bg-white/5">
            rank
          </div>
          <div className="col-span-3 sm:col-span-3 text-center py-1 px-2 rounded-xl border border-white/10 bg-white/5">
            votes
          </div>
        </div>

        {/* List of Leaderboard Entries */}
        {topPosts.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 font-mono text-sm">
            No entries found.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {topPosts.map((post, index) => {
              const rank = index + 1;
              const votes = post.wins;

              return (
                <div
                  key={post.id}
                  className="grid grid-cols-12 gap-2 sm:gap-4 items-center p-3 rounded-2xl border border-white/10 hover:border-fuchsia-500/50 bg-zinc-900/60 transition-all"
                >
                  {/* Image Column */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                      <img
                        src={post.imageUrl}
                        alt={post.caption || 'Image'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name Column */}
                  <div className="col-span-4 sm:col-span-4 text-center min-w-0">
                    <p className="font-mono text-sm sm:text-base font-bold text-white truncate">
                      {post.user.name || post.user.username || 'aman'}
                    </p>
                    {post.caption && (
                      <p className="text-[11px] text-zinc-400 font-sans truncate">
                        {post.caption}
                      </p>
                    )}
                  </div>

                  {/* Rank Column */}
                  <div className="col-span-2 sm:col-span-2 flex justify-center">
                    <span className="font-mono text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-xl bg-white/10 text-zinc-100 border border-white/10">
                      #{rank}
                    </span>
                  </div>

                  {/* Votes Column */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center">
                    <span className="font-mono text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/30 shadow-sm">
                      {votes} votes ({post.eloRating})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Large Container below table (matching wireframe bottom box) */}
      {topPost && (
        <div className="rounded-3xl border border-white/20 bg-zinc-950/80 p-4 sm:p-6 backdrop-blur-md shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-mono font-black text-sm uppercase text-amber-400 tracking-wider">
              #1 Ranked Image Leader
            </span>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 mx-auto max-w-xl">
            <img
              src={topPost.imageUrl}
              alt={topPost.caption || 'Leader'}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-left">
              <p className="font-mono text-lg font-extrabold text-white">
                {topPost.user.name || topPost.user.username}
              </p>
              {topPost.caption && (
                <p className="text-xs text-zinc-300 font-medium">
                  {topPost.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
