import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding VibeClash database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'VibeClash Admin',
      email: 'admin@vibeclash.io',
      password: 'adminpassword123',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      bio: 'System Administrator & Curator ⚡',
    },
  });

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { username: 'kai_vibe' },
    update: {},
    create: {
      username: 'kai_vibe',
      name: 'Kai Vance',
      email: 'kai@vibeclash.io',
      password: 'password123',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      bio: 'Cyberpunk Aesthetic & Streetwear Enthusiast ⚡',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'aria_fits' },
    update: {},
    create: {
      username: 'aria_fits',
      name: 'Aria Chen',
      email: 'aria@vibeclash.io',
      password: 'password123',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      bio: 'Minimalist Tokyo Street Fashion 🎌',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { username: 'neo_drip' },
    update: {},
    create: {
      username: 'neo_drip',
      name: 'Neo Rivera',
      email: 'neo@vibeclash.io',
      password: 'password123',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Y2K Vintage & High Fashion Curator 💎',
    },
  });

  // Create seed posts
  const postsData = [
    {
      caption: 'Neon Seoul Midnight Walk 🌆⚡',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      category: 'Cyberpunk',
      eloRating: 1420,
      wins: 18,
      losses: 4,
      userId: user1.id,
    },
    {
      caption: 'Minimalist Tokyo Layering 🖤 Techwear',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
      category: 'Minimalist',
      eloRating: 1380,
      wins: 15,
      losses: 6,
      userId: user2.id,
    },
    {
      caption: 'Y2K Chrome Leather Fit 🏎️✨',
      imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800',
      category: 'Vintage Y2K',
      eloRating: 1310,
      wins: 12,
      losses: 8,
      userId: user3.id,
    },
    {
      caption: 'Over-sized Grunge Overshirt Vibe 🎸',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
      category: 'Streetwear',
      eloRating: 1260,
      wins: 9,
      losses: 7,
      userId: user1.id,
    },
    {
      caption: 'Monochrome High Fashion Silhouette ✨',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      category: 'High Fashion',
      eloRating: 1210,
      wins: 8,
      losses: 9,
      userId: user2.id,
    },
  ];

  for (const post of postsData) {
    await prisma.post.create({ data: post });
  }

  // Initial site visits
  await prisma.siteVisit.createMany({
    data: [
      { ipAddress: '127.0.0.1' },
      { ipAddress: '192.168.1.1' },
      { ipAddress: '10.0.0.15' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
