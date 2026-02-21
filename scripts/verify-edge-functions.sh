#!/bin/bash
# Edge Function Deployment Verification Script
# Tests that all email edge functions are deployed and responding correctly.
#
# Usage:
#   chmod +x scripts/verify-edge-functions.sh
#   ./scripts/verify-edge-functions.sh
#
# Requirements:
#   - SUPABASE_URL and SUPABASE_ANON_KEY must be set (or they will be read from .env)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Read from .env if env vars not set
if [ -z "${SUPABASE_URL:-}" ]; then
  if [ -f .env ]; then
    SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d= -f2)
  fi
fi

if [ -z "${SUPABASE_ANON_KEY:-}" ]; then
  if [ -f .env ]; then
    SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_PUBLISHABLE_KEY .env | cut -d= -f2)
  fi
fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_ANON_KEY:-}" ]; then
  echo -e "${RED}ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set${NC}"
  echo "Set them as env vars or ensure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY"
  exit 1
fi

FUNCTIONS_URL="${SUPABASE_URL}/functions/v1"
PASS=0
FAIL=0
WARN=0

echo "================================================"
echo "  Edge Function Deployment Verification"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "================================================"
echo ""
echo "Supabase URL: ${SUPABASE_URL:0:40}..."
echo ""

# Test function: check health endpoint
test_health() {
  local func_name=$1
  local url="${FUNCTIONS_URL}/${func_name}?health=true"

  echo -n "  ${func_name}: "

  HTTP_CODE=$(curl -s -o /tmp/edge_response.txt -w "%{http_code}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    "${url}" 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}UNREACHABLE (network error)${NC}"
    FAIL=$((FAIL + 1))
    return
  fi

  RESPONSE=$(cat /tmp/edge_response.txt 2>/dev/null || echo "{}")

  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}HEALTHY (HTTP ${HTTP_CODE})${NC}"
    PASS=$((PASS + 1))
  elif [ "$HTTP_CODE" = "503" ]; then
    echo -e "${RED}UNHEALTHY (HTTP ${HTTP_CODE}) - Configuration error${NC}"
    echo "    Response: ${RESPONSE:0:200}"
    FAIL=$((FAIL + 1))
  elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${RED}NOT DEPLOYED (HTTP 404)${NC}"
    FAIL=$((FAIL + 1))
  else
    echo -e "${YELLOW}UNKNOWN (HTTP ${HTTP_CODE})${NC}"
    echo "    Response: ${RESPONSE:0:200}"
    WARN=$((WARN + 1))
  fi
}

# Test function: send a validation test (should return 400 for empty body)
test_validation() {
  local func_name=$1
  local url="${FUNCTIONS_URL}/${func_name}"

  echo -n "  ${func_name} (validation): "

  HTTP_CODE=$(curl -s -o /tmp/edge_response.txt -w "%{http_code}" \
    -X POST \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "${url}" 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}UNREACHABLE${NC}"
    FAIL=$((FAIL + 1))
    return
  fi

  RESPONSE=$(cat /tmp/edge_response.txt 2>/dev/null || echo "{}")

  if [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}PASS - correctly rejects invalid input (HTTP 400)${NC}"
    PASS=$((PASS + 1))
  elif [ "$HTTP_CODE" = "500" ]; then
    # Check if it's a config error vs runtime error
    if echo "$RESPONSE" | grep -q "configuration"; then
      echo -e "${RED}CONFIG ERROR - RESEND_API_KEY likely missing${NC}"
    else
      echo -e "${YELLOW}SERVER ERROR (HTTP 500) - may indicate missing deployment${NC}"
    fi
    echo "    Response: ${RESPONSE:0:200}"
    FAIL=$((FAIL + 1))
  elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${RED}NOT DEPLOYED (HTTP 404)${NC}"
    FAIL=$((FAIL + 1))
  else
    echo -e "${YELLOW}UNEXPECTED (HTTP ${HTTP_CODE})${NC}"
    echo "    Response: ${RESPONSE:0:200}"
    WARN=$((WARN + 1))
  fi
}

echo "--- Health Check Tests ---"
test_health "send-lead-email"
test_health "send-contact-email"
test_health "send-leadership-insights-email"
echo ""

echo "--- Validation Tests (send empty body, expect 400) ---"
test_validation "send-lead-email"
test_validation "send-contact-email"
test_validation "send-leadership-insights-email"
echo ""

# Cleanup
rm -f /tmp/edge_response.txt

echo "================================================"
echo "  Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}, ${YELLOW}${WARN} warnings${NC}"
echo "================================================"
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}ACTION REQUIRED:${NC}"
  echo "  1. Check that all edge functions are deployed:"
  echo "     supabase functions deploy send-lead-email"
  echo "     supabase functions deploy send-contact-email"
  echo "     supabase functions deploy send-leadership-insights-email"
  echo ""
  echo "  2. Check that RESEND_API_KEY is set in Supabase secrets:"
  echo "     supabase secrets set RESEND_API_KEY=re_your_key_here"
  echo ""
  echo "  3. Verify domain 'themindmaker.ai' is verified in Resend dashboard"
  echo ""
  exit 1
fi

echo -e "${GREEN}All checks passed.${NC}"
exit 0
