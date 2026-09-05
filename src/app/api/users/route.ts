import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - List all users (for demo switcher & user search)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            photos: true,
            votes: true,
            likes: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Register/Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, name, email, avatar, bio, styleTags, instagram } = body;

    if (!username || !name || !email) {
      return NextResponse.json({ error: 'Username, name, and email are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this username or email already exists' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        avatar: avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${username}`,
        bio: bio || '',
        styleTags: styleTags || 'Minimalist,Streetwear',
        instagram: instagram || '',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
