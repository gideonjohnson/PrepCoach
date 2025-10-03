import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@prepcoach.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'PrepCoach2025!Admin#Secure';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      // Update existing user to be admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          isAdmin: true,
          password: await bcrypt.hash(adminPassword, 12)
        }
      });
      console.log('✅ Existing user updated to admin:', adminEmail);
    } else {
      // Create new admin user
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 12),
          name: 'Admin',
          isAdmin: true,
          subscriptionTier: 'enterprise',
          subscriptionStatus: 'active'
        }
      });
      console.log('✅ Admin user created:', adminEmail);
    }

    console.log('\n🔐 Admin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n📝 Access admin portal at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
