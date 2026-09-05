'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface UserSession {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  role: string;
  image: string | null;
  bio: string | null;
}

export async function loginUser(username: string, password?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.password && password && user.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    const sessionUser: UserSession = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      bio: user.bio,
    };

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

export async function registerUser({
  username,
  name,
  password,
  email,
  bio,
  image,
}: {
  username: string;
  name?: string;
  password?: string;
  email?: string;
  bio?: string;
  image?: string;
}) {
  try {
    const cleanUsername = username.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        name: name || cleanUsername,
        password: password || 'password123',
        email: email || `${cleanUsername}@vibeclash.io`,
        role: 'USER',
        bio: bio || 'VibeClash Fashion Enthusiast ⚡',
        image:
          image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      },
    });

    const sessionUser: UserSession = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image,
      bio: newUser.bio,
    };

    revalidatePath('/leaderboard');
    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      posts: user.posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
