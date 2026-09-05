'use server';

import { prisma } from '@/lib/prisma';
import { calculateElo } from '@/lib/elo';
import { revalidatePath } from 'next/cache';

export interface PostWithUser {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string | null;
  eloRating: number;
  wins: number;
  losses: number;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

/**
 * Fetches 2 distinct random posts from the database for a 1v1 battle match-up.
 */
export async function getRandomPair(): Promise<[PostWithUser, PostWithUser] | null> {
  const totalPosts = await prisma.post.count();

  if (totalPosts < 2) {
    return null;
  }

  // Pick two distinct random indices
  const indexA = Math.floor(Math.random() * totalPosts);
  let indexB = Math.floor(Math.random() * totalPosts);

  while (indexB === indexA) {
    indexB = Math.floor(Math.random() * totalPosts);
  }

  const postA = await prisma.post.findFirst({
    skip: indexA,
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

  const postB = await prisma.post.findFirst({
    skip: indexB,
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

  if (!postA || !postB) {
    return null;
  }

  return [postA, postB];
}

/**
 * Casts a vote in a 1v1 battle, updates Elo ratings & stats via transaction, and logs the vote.
 */
export async function castVote(
  winnerId: string,
  loserId: string,
  voterId?: string
): Promise<{ success: boolean; winnerElo: number; loserElo: number }> {
  try {
    const winner = await prisma.post.findUnique({ where: { id: winnerId } });
    const loser = await prisma.post.findUnique({ where: { id: loserId } });

    if (!winner || !loser) {
      throw new Error('Winner or Loser post not found');
    }

    // Calculate new Elo ratings
    const { newWinnerRating, newLoserRating } = calculateElo(
      winner.eloRating,
      loser.eloRating
    );

    // Execute atomic Prisma transaction
    await prisma.$transaction([
      prisma.post.update({
        where: { id: winnerId },
        data: {
          eloRating: newWinnerRating,
          wins: { increment: 1 },
        },
      }),
      prisma.post.update({
        where: { id: loserId },
        data: {
          eloRating: newLoserRating,
          losses: { increment: 1 },
        },
      }),
      prisma.vote.create({
        data: {
          winnerId,
          loserId,
          voterId: voterId || null,
        },
      }),
    ]);

    // Revalidate paths for real-time UI updates
    revalidatePath('/battle');
    revalidatePath('/leaderboard');

    return {
      success: true,
      winnerElo: newWinnerRating,
      loserElo: newLoserRating,
    };
  } catch (error) {
    console.error('Error casting vote:', error);
    return {
      success: false,
      winnerElo: 0,
      loserElo: 0,
    };
  }
}

/**
 * Creates a new Post / Vibe
 */
export async function createPost({
  imageUrl,
  caption,
  category,
  userId,
}: {
  imageUrl: string;
  caption: string;
  category: string;
  userId: string;
}) {
  try {
    const post = await prisma.post.create({
      data: {
        imageUrl,
        caption,
        category: category || 'Streetwear',
        userId,
      },
    });

    revalidatePath('/battle');
    revalidatePath('/leaderboard');

    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}
