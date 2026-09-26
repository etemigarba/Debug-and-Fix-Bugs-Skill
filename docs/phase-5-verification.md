# Phase 5: Verification & Live Simulation

> **Do not theorize — execute.**

## Purpose

Prove every fix against the real running system. Capture exact server responses, reproduce original bug triggers, confirm fixes.

## The Four Steps

### 1. Verification Script

Develop a script that validates **every task in the checklist**:

```typescript
// scripts/verify-fixes.ts
import { execSync } from 'child_process';
import { validateApiContract } from './validate-contract';

const checks = [
  // Forbidden patterns are gone
  () => !grep('catch.*{}', 'src/**/*.ts'), // No empty catch blocks
  () => !grep('console.log', 'src/**/*.ts'), // No debug logging

  // Required handlers exist
  () => exists('src/services/auth.ts', 'requestSequenceToken'),
  () => exists('src/api/client.ts', 'fieldMapping'),

  // Schemas validate
  () => validateApiContract('src/api/contracts/user.json'),

  // Unit tests pass
  () => execSync('npm test', { stdio: 'ignore' }),
];

for (const check of checks) {
  if (!check()) throw new Error(`Verification failed: ${check.name}`);
}
console.log('✅ All verification checks passed');
```

**The implementation must pass this script.**

### 2. Run the Real Stack

Start everything as the user would:

```bash
# Backend (local DB)
docker compose up -d postgres
npm run db:migrate
npm run dev:server &

# Frontend
npm run dev:client &
```

Verify:
- Backend health endpoint responds
- Frontend loads without console errors
- Database seeded with test data (not mocks)

### 3. End-to-End Simulation

Drive actual user workflows through the running app.

#### Option A: agent-browser Skill (Preferred)
```typescript
// Using agent-browser for real browser automation
await browser.navigate('http://localhost:3000/login');
await browser.fill('#email', 'test@example.com');
await browser.fill('#password', 'password123');
await browser.click('button[type=submit]');

// Trigger the original bug: concurrent requests after refresh
await browser.waitForNetworkIdle();
await browser.evaluate(() => {
  // Fire 5 concurrent API calls that trigger token refresh
  return Promise.all([
    fetch('/api/user/profile'),
    fetch('/api/user/settings'),
    fetch('/api/user/notifications'),
    fetch('/api/user/posts'),
    fetch('/api/user/friends'),
  ]);
});

// Capture exact server responses at each stage
const responses = await browser.getNetworkResponses('/api/**');
validateResponsesAgainstSchema(responses, userSchema);
```

#### Option B: Scripted HTTP Flows (curl/Playwright)
```bash
# curl script for headless verification
#!/bin/bash
# 1. Login, capture tokens
LOGIN_RESP=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
ACCESS_TOKEN=$(echo $LOGIN_RESP | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESP | jq -r '.refreshToken')

# 2. Trigger concurrent requests with stale token
for i in {1..5}; do
  curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
    http://localhost:3000/api/user/profile &
done
wait

# 3. Validate all responses match schema
# (Use jq or node script for schema validation)
```

### 4. Reproduce Each Original Bug's Trigger

For **every defect in the register**, reproduce the exact trigger:

| Defect | Reproduction | Expected After Fix |
|--------|--------------|-------------------|
| DBG-001 Race condition | Fire 10 concurrent refresh requests | All succeed, no stale tokens |
| DBG-002 Contract mismatch | Call `/api/user/1` | Response maps `user_id` → `id` correctly |
| DBG-003 Swallowed exception | Cause auth error (invalid token) | Error logged, user sees actionable message |
| GAP-001 No timeout | Call slow external API (simulate 10s delay) | Request times out at 5s, fallback used |
| GAP-002 Missing states | Load profile with no posts | Empty state rendered, not blank screen |

**Fix failures and re-run until green.** A fix without a passing reproduction is a claim, not a fix.

## Evidence Capture

Document for the Readiness Report:

```markdown
## Verification Evidence

### Verification Script
- ✅ All 12 checks passed
- Script: `scripts/verify-fixes.ts`
- Run: `npm run verify` (exit code 0)

### Real Stack
- Backend: `http://localhost:3001` — healthy
- Frontend: `http://localhost:3000` — no console errors
- Database: PostgreSQL 16, seeded with `npm run db:seed`

### E2E Simulation (agent-browser)
- Session recorded: `evidence/e2e-session.webm`
- Network captures: `evidence/network-har-*.json`
- Schema validation: 47/47 responses valid

### Bug Reproduction
| Defect | Trigger Reproduced | Fix Confirmed | Evidence |
|--------|-------------------|---------------|----------|
| DBG-001 | ✅ 10 concurrent refreshes | ✅ All valid tokens | `evidence/dbg-001.har` |
| DBG-002 | ✅ GET /api/user/1 | ✅ Field mapped | `evidence/dbg-002.json` |
| DBG-003 | ✅ Invalid token | ✅ Error logged + UI | `evidence/dbg-003.log` |
| GAP-001 | ✅ 10s delayed API | ✅ 5s timeout + fallback | `evidence/gap-001.har` |
| GAP-002 | ✅ Empty posts array | ✅ Empty state rendered | `evidence/gap-002.png` |
```

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Theorizing without running | False confidence, production failures |
| Mock data in verification | Doesn't prove real system works |
| Not reproducing original trigger | Fix unproven, regression likely |
| Skipping schema validation | Contract drift undetected |

## Next Phase

With all verifications green → **[Phase 6: Readiness Report](phase-6-readiness-report.md)**