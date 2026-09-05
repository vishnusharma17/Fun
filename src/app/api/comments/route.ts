import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function POST(req: Request) {
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
