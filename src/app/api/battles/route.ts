import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/battles - Get active comparison battles
export async function GET() {
  try {
    const battles = await prisma.battle.findMany({
      include: {
        photoA: {
          include: {
            user: true,
            _count: { select: { likes: true, comments: true } },
          },
        },
        photoB: {
          include: {
            user: true,
            _count: { select: { likes: true, comments: true } },
          },
        },
        creator: true,
        votes: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(battles);
  } catch (error) {
    console.error('Failed to fetch battles:', error);
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 });
  }
}

// POST /api/battles - Create a new custom head-to-head comparison battle
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, photoAId, photoBId, creatorId } = body;

    if (!photoAId || !photoBId) {
      return NextResponse.json({ error: 'Two photos are required to form a battle' }, { status: 400 });
    }

    if (photoAId === photoBId) {
      return NextResponse.json({ error: 'Please select two distinct photos' }, { status: 400 });
    }

    const battle = await prisma.battle.create({
      data: {
        title: title || 'Aesthetic Style Battle',
        category: category || 'Custom Battle',
        photoAId,
        photoBId,
        creatorId: creatorId || null,
      },
      include: {
        photoA: {
          include: { user: true },
        },
        photoB: {
          include: { user: true },
        },
        votes: true,
      },
    });

    return NextResponse.json(battle, { status: 201 });
  } catch (error) {
    console.error('Failed to create battle:', error);
    return NextResponse.json({ error: 'Failed to create battle' }, { status: 500 });
  }
}
