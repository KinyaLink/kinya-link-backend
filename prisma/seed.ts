import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create subscription plans
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Basic',
      pricePerMonth: 9.99,
      description: 'Basic subscription plan with limited features.',
    },
  });

  const standardPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Standard',
      pricePerMonth: 19.99,
      description: 'Standard subscription plan with more features.',
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Premium',
      pricePerMonth: 29.99,
      description: 'Premium subscription plan with all features.',
    },
  });

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      avatarUrl: 'https://example.com/avatar1.png',
      googleId: 'google-id-123',
      facebookId: 'facebook-id-123',
      provider: 'google',
      subscriptions: {
        create: {
          planId: basicPlan.id,
          status: 'active',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: 'password456',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+0987654321',
      avatarUrl: 'https://example.com/avatar2.png',
      googleId: 'google-id-456',
      facebookId: 'facebook-id-456',
      provider: 'facebook',
      subscriptions: {
        create: {
          planId: premiumPlan.id,
          status: 'active',
        },
      },
    },
  });

  // Create a user without a subscription
  const user3 = await prisma.user.create({
    data: {
      email: 'alex.jones@example.com',
      password: 'password789',
      firstName: 'Alex',
      lastName: 'Jones',
      phoneNumber: '+1122334455',
      avatarUrl: 'https://example.com/avatar3.png',
      googleId: 'google-id-789',
      facebookId: 'facebook-id-789',
      provider: 'google',
      subscriptions: {
        create: {
          planId: standardPlan.id,
          status: 'inactive',
        },
      },
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
