import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/likes - Toggle like on photo or battle
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, photoId, battleId } = body;

    if (!userId || (!photoId && !battleId)) {
      return NextResponse.json({ error: 'userId and either photoId or battleId required' }, { status: 400 });
    }

    const whereCondition = photoId
      ? { userId_photoId_battleId: { userId, photoId, battleId: null as any } }
      : { userId_photoId_battleId: { userId, photoId: null as any, battleId } };

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        photoId: photoId || null,
        battleId: battleId || null,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId,
          photoId: photoId || null,
          battleId: battleId || null,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

// GET /api/comments - Fetch comments for photo or battle
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get('photoId');
    const battleId = searchParams.get('battleId');

    const comments = await prisma.comment.findMany({
      where: {
        photoId: photoId || undefined,
        battleId: battleId || undefined,
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments - Add comment to photo or battle
export async function POST_COMMENT(req: Request) {
  try {
    const body = await req.json();
    const { content, userId, photoId, battleId } = body;

    if (!content || !userId || (!photoId && !battleId)) {
      return NextResponse.json({ error: 'Content, userId, and photoId/battleId required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        photoId: photoId || null,
        battleId: battleId || null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Failed to post comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
