import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function grantRootAccess(email: string) {
  try {
    console.log(`\n🔐 Granting root access to: ${email}`);
    console.log('━'.repeat(50));

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user
      console.log('✓ User found, updating permissions...');

      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          isAdmin: true,
          subscriptionTier: 'lifetime',
          subscriptionStatus: 'active',
          subscriptionStart: new Date(),
          subscriptionEnd: null, // Lifetime = no end date
          emailVerified: existingUser.emailVerified || new Date(),
          interviewsThisMonth: 999999, // Unlimited
          feedbackThisMonth: 999999, // Unlimited
        },
      });

      console.log('\n✅ ROOT ACCESS GRANTED!');
      console.log('━'.repeat(50));
      console.log('User Details:');
      console.log(`  ID: ${updatedUser.id}`);
      console.log(`  Email: ${updatedUser.email}`);
      console.log(`  Name: ${updatedUser.name || 'Not set'}`);
      console.log(`  Admin: ${updatedUser.isAdmin ? 'YES ✓' : 'NO'}`);
      console.log(`  Subscription: ${updatedUser.subscriptionTier.toUpperCase()}`);
      console.log(`  Status: ${updatedUser.subscriptionStatus}`);
      console.log(`  Email Verified: ${updatedUser.emailVerified ? 'YES ✓' : 'NO'}`);
      console.log('━'.repeat(50));

    } else {
      // Create new user with root access
      console.log('✓ User not found, creating new account with root access...');

      // Generate a random secure password (they'll use Google OAuth anyway)
      const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'Root Admin',
          password: hashedPassword,
          emailVerified: new Date(),
          isAdmin: true,
          subscriptionTier: 'lifetime',
          subscriptionStatus: 'active',
          subscriptionStart: new Date(),
          subscriptionEnd: null, // Lifetime = no end date
          interviewsThisMonth: 999999, // Unlimited
          feedbackThisMonth: 999999, // Unlimited
        },
      });

      console.log('\n✅ ROOT ACCESS GRANTED!');
      console.log('━'.repeat(50));
      console.log('New User Created:');
      console.log(`  ID: ${newUser.id}`);
      console.log(`  Email: ${newUser.email}`);
      console.log(`  Name: ${newUser.name}`);
      console.log(`  Admin: ${newUser.isAdmin ? 'YES ✓' : 'NO'}`);
      console.log(`  Subscription: ${newUser.subscriptionTier.toUpperCase()}`);
      console.log(`  Status: ${newUser.subscriptionStatus}`);
      console.log(`  Email Verified: YES ✓`);
      console.log('\n💡 Login method: Use "Sign in with Google" at https://aiprep.work');
      console.log('━'.repeat(50));
    }

    console.log('\n🎉 Root access successfully granted!');
    console.log('✓ Admin privileges: ENABLED');
    console.log('✓ Lifetime subscription: ACTIVE');
    console.log('✓ Unlimited interviews: YES');
    console.log('✓ Unlimited AI feedback: YES');
    console.log('✓ All premium features: UNLOCKED');
    console.log('━'.repeat(50));

  } catch (error) {
    console.error('\n❌ Error granting root access:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
const email = process.argv[2] || 'gideonbosiregj@gmail.com';
grantRootAccess(email);
