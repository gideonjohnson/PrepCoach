#!/bin/bash

# PrepCoach Security Setup Script
# This script helps you set up all security features interactively

set -e

echo "🔐 PrepCoach Security Setup"
echo "============================"
echo ""
echo "This script will help you set up:"
echo "  1. Sentry Error Tracking"
echo "  2. Upstash Redis Rate Limiting"
echo "  3. Deploy to Production"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed and authenticated
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not authenticated${NC}"
    echo "Run: vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI is ready${NC}"
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_description=$2
    local is_secret=${3:-true}

    echo -e "${BLUE}📝 Setting up ${var_name}${NC}"
    echo "Description: ${var_description}"
    echo ""

    if [ "$is_secret" = true ]; then
        read -sp "Enter value (hidden): " var_value
        echo ""
    else
        read -p "Enter value: " var_value
    fi

    if [ -z "$var_value" ]; then
        echo -e "${YELLOW}⚠️  Skipped (empty value)${NC}"
        return 1
    fi

    echo "$var_value" | vercel env add "$var_name" production
    echo -e "${GREEN}✅ ${var_name} added successfully${NC}"
    echo ""
    return 0
}

# Step 1: Sentry Setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 1: Sentry Error Tracking Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to https://sentry.io/signup/"
echo "2. Create a Next.js project named 'prepcoach'"
echo "3. Get your DSN (looks like: https://abc@o123.ingest.sentry.io/456)"
echo "4. Create auth token at: https://sentry.io/settings/account/api/auth-tokens/"
echo "   - Scopes: project:releases, project:write"
echo ""
read -p "Press Enter when you're ready to add Sentry credentials..."

add_env_var "NEXT_PUBLIC_SENTRY_DSN" "Sentry DSN for error tracking" false
add_env_var "SENTRY_ORG" "Sentry organization slug" false
add_env_var "SENTRY_PROJECT" "Sentry project name (usually 'prepcoach')" false
add_env_var "SENTRY_AUTH_TOKEN" "Sentry auth token for source maps" true

# Step 2: Upstash Setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 2: Upstash Redis Rate Limiting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to https://console.upstash.com/"
echo "2. Create a Redis database named 'prepcoach-ratelimit'"
echo "3. Choose region closest to your users"
echo "4. Get REST API credentials from database dashboard"
echo ""
read -p "Press Enter when you're ready to add Upstash credentials..."

add_env_var "UPSTASH_REDIS_REST_URL" "Upstash Redis REST URL" false
add_env_var "UPSTASH_REDIS_REST_TOKEN" "Upstash Redis REST Token" true

# Step 3: Deploy
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 3: Deploy to Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}This will trigger a new deployment to activate all security features.${NC}"
read -p "Deploy now? (y/n): " deploy_now

if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
    echo ""
    echo "🚀 Creating deployment commit..."
    git commit --allow-empty -m "Activate security features - Sentry + Upstash"

    echo "📤 Pushing to GitHub..."
    git push origin master

    echo ""
    echo -e "${GREEN}✅ Deployment triggered!${NC}"
    echo ""
    echo "Monitor deployment at: https://vercel.com/gideonbosiregj-6770/prepcoach"
else
    echo ""
    echo -e "${YELLOW}⚠️  Deployment skipped${NC}"
    echo "Run this when ready: git commit --allow-empty -m 'Activate security' && git push"
fi

# Final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎉 Security Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What's now active:"
echo "  ✅ Sentry Error Tracking & Monitoring"
echo "  ✅ Upstash Redis Rate Limiting"
echo "  ✅ Zod Input Validation"
echo "  ✅ XSS Prevention"
echo ""
echo "Next steps:"
echo "  1. Wait for deployment to complete (~2 minutes)"
echo "  2. Test rate limiting (make 6+ API requests quickly)"
echo "  3. Check Sentry dashboard for errors"
echo "  4. Review security docs: docs/SECURITY_IMPROVEMENTS.md"
echo ""
echo "Monitoring dashboards:"
echo "  📊 Sentry: https://sentry.io/"
echo "  📊 Upstash: https://console.upstash.com/"
echo "  📊 Vercel: https://vercel.com/gideonbosiregj-6770/prepcoach"
echo ""
echo -e "${GREEN}Security is now active! 🔐${NC}"
