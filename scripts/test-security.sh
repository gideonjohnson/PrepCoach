#!/bin/bash

# PrepCoach Security Testing Script
# This script tests all security features

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SITE_URL="https://aiprep.work"
API_BASE="$SITE_URL/api"

echo "🧪 PrepCoach Security Testing"
echo "=============================="
echo ""

# Test 1: Input Validation - Weak Password
echo "Test 1: Input Validation - Weak Password"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }')

if echo "$response" | grep -q "validation\|Validation"; then
    echo -e "${GREEN}✅ PASS: Weak password rejected${NC}"
else
    echo -e "${RED}❌ FAIL: Weak password accepted${NC}"
    echo "Response: $response"
fi
echo ""

# Test 2: Input Validation - Invalid Email
echo "Test 2: Input Validation - Invalid Email"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "not-an-email",
    "password": "StrongPass123"
  }')

if echo "$response" | grep -q "validation\|Validation\|email"; then
    echo -e "${GREEN}✅ PASS: Invalid email rejected${NC}"
else
    echo -e "${RED}❌ FAIL: Invalid email accepted${NC}"
    echo "Response: $response"
fi
echo ""

# Test 3: Input Validation - Missing Fields
echo "Test 3: Input Validation - Missing Required Fields"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }')

if echo "$response" | grep -q "validation\|Validation\|required"; then
    echo -e "${GREEN}✅ PASS: Missing fields rejected${NC}"
else
    echo -e "${RED}❌ FAIL: Missing fields accepted${NC}"
    echo "Response: $response"
fi
echo ""

# Test 4: XSS Prevention
echo "Test 4: XSS Prevention - Script Tag in Input"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(1)</script>",
    "email": "test@example.com",
    "password": "StrongPass123"
  }')

# Note: Without auth, this will likely fail at "user exists" or "validation"
# The point is to ensure script tags don't execute
if ! echo "$response" | grep -q "<script>"; then
    echo -e "${GREEN}✅ PASS: Script tags sanitized or rejected${NC}"
else
    echo -e "${RED}❌ WARNING: Script tags in response${NC}"
    echo "Response: $response"
fi
echo ""

# Test 5: Rate Limiting (requires multiple requests)
echo "Test 5: Rate Limiting - Signup Endpoint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Making 6 rapid requests (limit is 5 per minute)..."

rate_limited=false
for i in {1..6}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/auth/signup" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"Test User $i\",
        \"email\": \"test$i@example.com\",
        \"password\": \"StrongPass123\"
      }")

    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "429" ]; then
        rate_limited=true
        echo -e "  Request $i: ${YELLOW}429 Rate Limited${NC}"
        break
    else
        echo -e "  Request $i: ${GREEN}$http_code${NC}"
    fi

    # Small delay to not overwhelm
    sleep 0.1
done

if [ "$rate_limited" = true ]; then
    echo -e "${GREEN}✅ PASS: Rate limiting is working${NC}"
else
    echo -e "${YELLOW}⚠️  NOTICE: Rate limiting may not be configured${NC}"
    echo "  (This is expected if Upstash Redis is not set up)"
fi
echo ""

# Test 6: Check Response Headers
echo "Test 6: Security Headers Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
headers=$(curl -s -I "$SITE_URL" | tr -d '\r')

# Check for important security headers
if echo "$headers" | grep -qi "x-frame-options"; then
    echo -e "${GREEN}✅ X-Frame-Options header present${NC}"
else
    echo -e "${YELLOW}⚠️  X-Frame-Options header missing${NC}"
fi

if echo "$headers" | grep -qi "x-content-type-options"; then
    echo -e "${GREEN}✅ X-Content-Type-Options header present${NC}"
else
    echo -e "${YELLOW}⚠️  X-Content-Type-Options header missing${NC}"
fi

if echo "$headers" | grep -qi "strict-transport-security"; then
    echo -e "${GREEN}✅ HSTS header present${NC}"
else
    echo -e "${YELLOW}⚠️  HSTS header missing (expected on HTTPS)${NC}"
fi
echo ""

# Test 7: Sentry Integration Check
echo "Test 7: Sentry Integration Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
page_source=$(curl -s "$SITE_URL")

if echo "$page_source" | grep -q "sentry\|monitoring"; then
    echo -e "${GREEN}✅ Sentry appears to be integrated${NC}"
else
    echo -e "${YELLOW}⚠️  Sentry integration not detected in page source${NC}"
    echo "  (This is expected if NEXT_PUBLIC_SENTRY_DSN is not set)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Security features tested:"
echo "  ✅ Input validation (passwords, emails)"
echo "  ✅ XSS prevention"
echo "  ✅ Rate limiting (requires Upstash Redis)"
echo "  ✅ Security headers"
echo "  ✅ Error tracking integration"
echo ""
echo "To fully activate all features:"
echo "  1. Set up Sentry: https://sentry.io/"
echo "  2. Set up Upstash: https://console.upstash.com/"
echo "  3. Run: bash scripts/setup-security.sh"
echo ""
echo "For detailed setup instructions, see: ACTIVATE_SECURITY.md"
