const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = '$2b$12$zHKPhXZd7zzHg8drBbXDF.JYknw83otzg1TPcTuwFxqdk1kFvfvTy';
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@aiprep.work' },
      update: {
        password: hashedPassword,
        isAdmin: true,
        subscriptionTier: 'lifetime',
        subscriptionStatus: 'active',
        emailVerified: new Date(),
      },
      create: {
        name: 'PrepCoach Admin',
        email: 'admin@aiprep.work',
        password: hashedPassword,
        isAdmin: true,
        subscriptionTier: 'lifetime',
        subscriptionStatus: 'active',
        emailVerified: new Date(),
        interviewsThisMonth: 0,
        feedbackThisMonth: 0,
      },
    });

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('=================================');
    console.log('MASTER ADMIN CREDENTIALS');
    console.log('=================================');
    console.log('Email: admin@aiprep.work');
    console.log('Password: PrepCoach2025!Admin');
    console.log('=================================');
    console.log('');
    console.log('Admin ID:', admin.id);
    console.log('Admin status:', admin.isAdmin ? 'Admin ✓' : 'Regular User');
    console.log('Subscription:', admin.subscriptionTier);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
