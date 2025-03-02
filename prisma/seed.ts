import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash a default password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      provider: 'email',
      stripeCustomerId: 'cus_123456',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '0987654321',
      provider: 'email',
      stripeCustomerId: 'cus_654321',
    },
  });

  // Create subscription plans
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic' },
    update: {},
    create: {
      id: 'basic',
      name: 'Basic',
      pricePerMonth: 9.99,
      description: 'Basic subscription plan',
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'premium' },
    update: {},
    create: {
      id: 'premium',
      name: 'Premium',
      pricePerMonth: 19.99,
      description: 'Premium subscription plan with extra features',
    },
  });

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      userId: user1.id,
      planId: basicPlan.id,
      status: 'active',
      startDate: new Date(),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user2.id,
      planId: premiumPlan.id,
      status: 'active',
      startDate: new Date(),
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
