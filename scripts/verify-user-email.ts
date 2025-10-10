import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyUserEmail() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log('Usage: npx tsx scripts/verify-user-email.ts <email>');
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log(`✅ Email already verified for: ${email}`);
      console.log(`Verified at: ${user.emailVerified}`);
      return;
    }

    // Verify the email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete any pending verification tokens
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    console.log('\n✅ SUCCESS! Email verified!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Verified: ${updatedUser.emailVerified}`);
    console.log(`Name: ${updatedUser.name}`);
    console.log(`Subscription: ${updatedUser.subscriptionTier}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('You can now sign in! 🎉\n');

  } catch (error) {
    console.error('Error verifying email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUserEmail();
