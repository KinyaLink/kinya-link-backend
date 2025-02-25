import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a local user
  await prisma.user.create({
    data: {
      email: 'localuser@example.com',
      password: 'hashed_password_here', // Normally, hash the password before storing
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      provider: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create a user via Google OAuth
  await prisma.user.create({
    data: {
      email: 'googleuser@example.com',
      googleId: 'google_oauth_id_123456',
      firstName: 'Jane',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/google-avatar.jpg',
      provider: 'google',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create a user via Facebook OAuth
  await prisma.user.create({
    data: {
      email: 'facebookuser@example.com',
      facebookId: 'facebook_oauth_id_987654',
      firstName: 'Alice',
      lastName: 'Johnson',
      avatarUrl: 'https://example.com/facebook-avatar.jpg',
      provider: 'facebook',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
