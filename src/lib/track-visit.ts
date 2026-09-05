import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * Logs unique or total page visits in the background without blocking render.
 */
export async function logVisit(): Promise<void> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : headersList.get('x-real-ip') || '127.0.0.1';

    await prisma.siteVisit.create({
      data: {
        ipAddress,
      },
    });
  } catch (error) {
    // Fail silently so layout rendering is never blocked
    console.error('Error logging site visit:', error);
  }
}
