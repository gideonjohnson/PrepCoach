import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function grantLifetimeAccess() {
  try {
    // Get the first user (assuming it's your account)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      take: 1
    });

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    const user = users[0];
    console.log(`Found user: ${user.email}`);

    // Update to lifetime Pro access
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'lifetime',
        subscriptionStatus: 'active',
        subscriptionStart: new Date(),
        subscriptionEnd: null, // Null means never expires
        interviewsThisMonth: 0,
        feedbackThisMonth: 0,
      }
    });

    console.log('\n✅ SUCCESS! Lifetime access granted!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Subscription: ${updatedUser.subscriptionTier}`);
    console.log(`Status: ${updatedUser.subscriptionStatus}`);
    console.log(`Started: ${updatedUser.subscriptionStart}`);
    console.log(`Expires: Never! 🎉`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('You now have unlimited:');
    console.log('  ✓ Interviews per month');
    console.log('  ✓ AI feedback requests');
    console.log('  ✓ Resume generation');
    console.log('  ✓ ATS optimization');
    console.log('  ✓ All premium features');
    console.log('\nEnjoy your lifetime access! 🚀\n');

  } catch (error) {
    console.error('Error granting lifetime access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

grantLifetimeAccess();
