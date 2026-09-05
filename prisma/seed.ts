import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.battle.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const elena = await prisma.user.create({
    data: {
      username: 'elena_vogue',
      name: 'Elena Rostova',
      email: 'elena@stylearena.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bio: 'Fashion Strategist & Monochrome Enthusiast. Tokyo / Paris.',
      styleTags: 'Minimalist,High Fashion,Avant-Garde',
      instagram: '@elena_vogue',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      username: 'marcus_streetwear',
      name: 'Marcus Chen',
      email: 'marcus@stylearena.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      bio: 'Archival outerwear collector & Sneakerhead. NYC.',
      styleTags: 'Streetwear,Techwear,Vintage',
      instagram: '@marcus_kicks',
    },
  });

  const sophia = await prisma.user.create({
    data: {
      username: 'sophia_luxe',
      name: 'Sophia Laurent',
      email: 'sophia@stylearena.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      bio: 'Tailoring, Old Money aesthetic & Classic Elegance. Milan.',
      styleTags: 'Formal,Old Money,Elegance',
      instagram: '@sophia_laurent',
    },
  });

  const kai = await prisma.user.create({
    data: {
      username: 'kai_cyber',
      name: 'Kai Takahashi',
      email: 'kai@stylearena.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      bio: 'Cyberpunk aesthetic & Experimental silhouettes. Berlin.',
      styleTags: 'Y2K,Cyberpunk,Experimental',
      instagram: '@kai_futura',
    },
  });

  console.log('Users created.');

  // Create Style Photos
  const p1 = await prisma.photo.create({
    data: {
      title: 'Oversized Double-Breasted Wool Coat',
      description: 'Structured silhouette styled with tailored wide-leg trousers and sleek leather boots.',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      category: 'Minimalist',
      outfitTags: 'Jil Sander Coat, Bottega Veneta Boots, Studio Nicholson Trousers',
      views: 342,
      userId: elena.id,
    },
  });

  const p2 = await prisma.photo.create({
    data: {
      title: 'Urban Archival Tech Shell & Cargo Set',
      description: 'Gore-Tex waterproof shell jacket paired with modular tactical pants and Salomon XT-6.',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      category: 'Streetwear',
      outfitTags: 'ArcTeryx Veilance, Acronym Cargo, Salomon XT-6',
      views: 512,
      userId: marcus.id,
    },
  });

  const p3 = await prisma.photo.create({
    data: {
      title: 'Monochrome Sculptural Blazer Dress',
      description: 'Asymmetric lapel tailoring with clean geometry and silver hardware accents.',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      category: 'High Fashion',
      outfitTags: 'Maison Margiela, Alexander McQueen Accessories',
      views: 420,
      userId: elena.id,
    },
  });

  const p4 = await prisma.photo.create({
    data: {
      title: 'Classic Cashmere Trench & Leather Tote',
      description: 'Timeless camel trench layered over cream knitwear and structured Italian leather bag.',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80',
      category: 'Formal',
      outfitTags: 'Burberry Trench, Loro Piana Cashmere, Celine Tote',
      views: 289,
      userId: sophia.id,
    },
  });

  const p5 = await prisma.photo.create({
    data: {
      title: 'Neofuturistic Metallic Layering Look',
      description: 'Reflective nylon vest over dark distressed hoodie with high-top platform sneakers.',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      category: 'Y2K',
      outfitTags: 'Rick Owens Owenscorp, Alyx Studio Belt, Balenciaga Defender',
      views: 610,
      userId: kai.id,
    },
  });

  const p6 = await prisma.photo.create({
    data: {
      title: 'Vintage Leather Biker Jacket & Denim',
      description: 'Worn-in 90s Schott leather jacket paired with Japanese selvedge denim and vintage boots.',
      imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
      category: 'Vintage',
      outfitTags: 'Schott NYC Vintage 1994, Iron Heart 21oz Denim, Red Wing Heritage',
      views: 455,
      userId: marcus.id,
    },
  });

  console.log('Photos created.');

  // Create Battles / Comparisons
  const battle1 = await prisma.battle.create({
    data: {
      title: 'Minimalist Tailoring vs Archival Techwear',
      category: 'Mainstage Battle',
      photoAId: p1.id,
      photoBId: p2.id,
      creatorId: elena.id,
    },
  });

  const battle2 = await prisma.battle.create({
    data: {
      title: 'High Fashion Sculpture vs Classic Old Money Trench',
      category: 'Luxury Showdown',
      photoAId: p3.id,
      photoBId: p4.id,
      creatorId: sophia.id,
    },
  });

  const battle3 = await prisma.battle.create({
    data: {
      title: 'Futuristic Y2K Silhouette vs 90s Vintage Biker',
      category: 'Subculture Battle',
      photoAId: p5.id,
      photoBId: p6.id,
      creatorId: kai.id,
    },
  });

  console.log('Battles created.');

  // Seed Initial Votes
  await prisma.vote.createMany({
    data: [
      { userId: sophia.id, battleId: battle1.id, selectedPhotoId: p1.id },
      { userId: kai.id, battleId: battle1.id, selectedPhotoId: p2.id },
      { userId: marcus.id, battleId: battle1.id, selectedPhotoId: p2.id },
      { userId: elena.id, battleId: battle2.id, selectedPhotoId: p3.id },
      { userId: kai.id, battleId: battle2.id, selectedPhotoId: p3.id },
      { userId: marcus.id, battleId: battle2.id, selectedPhotoId: p4.id },
    ],
  });

  // Seed Likes & Comments
  await prisma.like.create({
    data: { userId: sophia.id, photoId: p1.id },
  });
  await prisma.like.create({
    data: { userId: kai.id, photoId: p2.id },
  });
  await prisma.like.create({
    data: { userId: elena.id, battleId: battle1.id },
  });

  await prisma.comment.create({
    data: {
      content: 'The drape on this coat is absolutely unmatched! Perfection.',
      userId: sophia.id,
      photoId: p1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Techwear done right with great texture balance.',
      userId: kai.id,
      photoId: p2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Tough decision! Minimalist vs Techwear is the ultimate contrast.',
      userId: marcus.id,
      battleId: battle1.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
