/**
 * Paystack Connection Test Script
 *
 * This script tests your Paystack API connection and verifies
 * that your API keys are working correctly.
 *
 * Run with: npx tsx scripts/test-paystack.ts
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Load environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPaystackConnection() {
  log('\n🔍 Testing Paystack Connection...\n', 'cyan');

  // Check if keys are configured
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'your_paystack_secret_key_here') {
    log('❌ PAYSTACK_SECRET_KEY is not configured', 'red');
    log('   Please add your Paystack secret key to .env file\n', 'yellow');
    process.exit(1);
  }

  if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY === 'your_paystack_public_key_here') {
    log('❌ NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured', 'red');
    log('   Please add your Paystack public key to .env file\n', 'yellow');
    process.exit(1);
  }

  // Display key info (masked)
  log('✅ API Keys Found:', 'green');
  log(`   Secret Key: ${PAYSTACK_SECRET_KEY.substring(0, 15)}...`, 'blue');
  log(`   Public Key: ${PAYSTACK_PUBLIC_KEY.substring(0, 15)}...\n`, 'blue');

  // Test 1: Verify API Keys
  log('📡 Test 1: Verifying API Keys...', 'cyan');
  try {
    const response = await axios.get('https://api.paystack.co/transaction', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.status === 200) {
      log('✅ API Keys are valid!\n', 'green');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      log('❌ Invalid API Keys', 'red');
      log('   Please check your Paystack secret key\n', 'yellow');
      process.exit(1);
    } else {
      log(`✅ API Keys are valid! (${error.response?.status || 'Unknown status'})\n`, 'green');
    }
  }

  // Test 2: List Plans
  log('📋 Test 2: Fetching Subscription Plans...', 'cyan');
  try {
    const response = await axios.get('https://api.paystack.co/plan', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.status && response.data.data) {
      const plans = response.data.data;

      if (plans.length === 0) {
        log('⚠️  No subscription plans found', 'yellow');
        log('   You need to create subscription plans in Paystack Dashboard\n', 'yellow');
      } else {
        log(`✅ Found ${plans.length} plan(s):`, 'green');
        plans.forEach((plan: any) => {
          const amount = plan.amount / 100; // Convert from kobo to naira
          log(`   • ${plan.name} - ₦${amount.toLocaleString()}/${plan.interval}`, 'blue');
          log(`     Plan Code: ${plan.plan_code}`, 'blue');
        });
        log('');
      }
    }
  } catch (error: any) {
    log('❌ Failed to fetch plans', 'red');
    log(`   Error: ${error.message}\n`, 'red');
  }

  // Test 3: Check Environment Variables
  log('🔧 Test 3: Checking Environment Variables...', 'cyan');
  const envVars = {
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    PAYSTACK_PRO_PLAN_CODE: process.env.PAYSTACK_PRO_PLAN_CODE,
    PAYSTACK_ENTERPRISE_PLAN_CODE: process.env.PAYSTACK_ENTERPRISE_PLAN_CODE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  let missingVars = 0;
  for (const [key, value] of Object.entries(envVars)) {
    if (!value || value.startsWith('your_') ||
        (key.includes('PLAN_CODE') && (value === 'PLN_pro_monthly' || value === 'PLN_enterprise_monthly'))) {
      log(`⚠️  ${key} not configured`, 'yellow');
      missingVars++;
    } else {
      log(`✅ ${key} configured`, 'green');
    }
  }

  if (missingVars > 0) {
    log(`\n⚠️  ${missingVars} environment variable(s) need configuration`, 'yellow');
  } else {
    log('\n✅ All environment variables configured!', 'green');
  }

  // Summary
  log('\n📊 Summary:', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  if (missingVars === 0) {
    log('✅ Paystack integration is ready!', 'green');
    log('   You can now test payments on your site\n', 'green');
  } else {
    log('⚠️  Setup incomplete - next steps:', 'yellow');
    if (!process.env.PAYSTACK_PRO_PLAN_CODE?.startsWith('PLN_') ||
        !process.env.PAYSTACK_ENTERPRISE_PLAN_CODE?.startsWith('PLN_')) {
      log('   1. Create subscription plans in Paystack Dashboard', 'yellow');
      log('   2. Update plan codes in .env file', 'yellow');
    }
    log('   3. Restart your dev server\n', 'yellow');
  }
}

// Run the test
testPaystackConnection().catch((error) => {
  log(`\n❌ Test failed: ${error.message}`, 'red');
  process.exit(1);
});
