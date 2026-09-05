import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        photos: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                likes: true,
                comments: true,
                votes: true,
              },
            },
          },
        },
        _count: {
          select: {
            photos: true,
            votes: true,
            likes: true,
            createdBattles: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate battle win stats for user's photos
    const userPhotoIds = user.photos.map((p) => p.id);

    const battlesAsPhotoA = await prisma.battle.findMany({
      where: { photoAId: { in: userPhotoIds } },
      include: { votes: true },
    });

    const battlesAsPhotoB = await prisma.battle.findMany({
      where: { photoBId: { in: userPhotoIds } },
      include: { votes: true },
    });

    let totalBattles = 0;
    let totalWins = 0;

    for (const battle of battlesAsPhotoA) {
      if (battle.votes.length > 0) {
        totalBattles++;
        const votesA = battle.votes.filter((v) => v.selectedPhotoId === battle.photoAId).length;
        const votesB = battle.votes.length - votesA;
        if (votesA > votesB) totalWins++;
      }
    }

    for (const battle of battlesAsPhotoB) {
      if (battle.votes.length > 0) {
        totalBattles++;
        const votesB = battle.votes.filter((v) => v.selectedPhotoId === battle.photoBId).length;
        const votesA = battle.votes.length - votesB;
        if (votesB > votesA) totalWins++;
      }
    }

    const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;

    return NextResponse.json({
      ...user,
      stats: {
        totalBattles,
        totalWins,
        winRate,
        totalLikes: user.photos.reduce((acc, p) => acc + p._count.likes, 0),
      },
    });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
