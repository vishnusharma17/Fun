import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/battles/vote - Submit a vote in a comparison battle
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { battleId, selectedPhotoId, userId } = body;

    if (!battleId || !selectedPhotoId || !userId) {
      return NextResponse.json({ error: 'battleId, selectedPhotoId, and userId are required' }, { status: 400 });
    }

    // Check if user already voted on this battle
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_battleId: {
          userId,
          battleId,
        },
      },
    });

    if (existingVote) {
      // Update vote choice if already voted
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { selectedPhotoId },
      });
      return NextResponse.json({ message: 'Vote updated', vote: updatedVote });
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        battleId,
        selectedPhotoId,
        userId,
      },
    });

    return NextResponse.json({ message: 'Vote recorded', vote }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}
