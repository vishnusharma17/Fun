import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/photos - List all uploaded photos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (userId) {
      where.userId = userId;
    }

    const photos = await prisma.photo.findMany({
      where,
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

// POST /api/photos - Upload a new look/photo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, category, outfitTags, userId } = body;

    if (!title || !imageUrl || !category || !userId) {
      return NextResponse.json(
        { error: 'Title, Image URL, Category, and User ID are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const photo = await prisma.photo.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        category,
        outfitTags: outfitTags || '',
        userId,
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Failed to create photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
