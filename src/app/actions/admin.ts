'use server';

import { prisma } from '@/lib/prisma';

export interface AdminStats {
  totalVisits: number;
  totalUsers: number;
  totalVotes: number;
  totalPosts: number;
  recentVisits: Array<{
    id: string;
    ipAddress: string | null;
    createdAt: Date;
  }>;
}

/**
 * Returns summary statistics for the Admin Dashboard
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [totalVisits, totalUsers, totalVotes, totalPosts, recentVisits] =
      await Promise.all([
        prisma.siteVisit.count(),
        prisma.user.count(),
        prisma.vote.count(),
        prisma.post.count(),
        prisma.siteVisit.findMany({
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

    return {
      totalVisits,
      totalUsers,
      totalVotes,
      totalPosts,
      recentVisits,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalVisits: 0,
      totalUsers: 0,
      totalVotes: 0,
      totalPosts: 0,
      recentVisits: [],
    };
  }
}
