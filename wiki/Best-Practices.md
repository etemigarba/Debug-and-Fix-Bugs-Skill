# Best Practices

Pro tips from production debugging engagements.

---

## Phase 0: Confidence Gate

### Do
- **Reproduce first, always** — Even if "obvious," capture exact error + steps
- **Ask "what does fixed look like?"** — Get measurable criteria (0 errors, <100ms p99, etc.)
- **State assumptions explicitly** — "Assuming PostgreSQL 15, JWT auth, Node 20"
- **Time-box Phase 0** — 30 min max for typical bugs; 2 hrs for complex systems

### Don't
- Skip reproduction because "I know the fix"
- Assume cloud == local (verify DB, Redis, auth)
- Accept vague "make it work" as a success criterion

---

## Phase 1: Analysis

### Evidence Collection
```bash
# Capture real API responses
curl -s -D - http://localhost:3000/api/user/1 > evidence/response.txt

# Trace execution with temporary logs
# Add: console.log('[DEBUG]', { fn: 'refreshToken', step: 'before-await', token })
# Then: grep '\[DEBUG\]' evidence/run.log

# Compare contracts
# 1. Get actual response: curl ... | jq . > evidence/actual.json
# 2. Get expected schema: cat src/api/contracts/user.json
# 3. Validate: ajv validate -s schema.json -d actual.json
```

### Mapping Tips
- **Draw it** — Mermaid diagrams in comments help mental model
- **Focus on async boundaries** — Where await happens, races hide
- **Check error paths** — Happy path is 20% of bugs

### Common Findings
| Pattern | Where to Look |
|---------|---------------|
| N+1 queries | Loop with await inside |
| Stale closures | useEffect deps, event handlers |
| Contract drift | API adds field, client doesn't handle |
| Silent failures | Empty catch, Promise without .catch() |

---

## Phase 2: Defect Register

### Writing Good Root Causes

| Weak | Strong |
|------|--------|
| "Race condition" | "Concurrent refreshToken() calls share mutable accessToken; no sequencing → last write wins" |
| "Validation missing" | "POST /api/user accepts negative age; DB constraint catches but returns 500 not 400" |
| "Performance issue" | "getUserPosts() does N+1: 1 query for user, then 1 query per post (50 posts = 51 queries)" |

### Prioritization Discipline
- **Fix critical first** — Even if easier bugs exist
- **Batch related** — Fix all auth bugs together
- **Defer strategically** — Low-priority gaps → technical debt tracker

---

## Phase 3: Refactoring

### Surgical Discipline
```typescript
// ✅ Good: exact fix, annotated
// Fixes DBG-001: adds request sequence token to prevent stale response overwrite
let requestSeq = 0;
async function refreshToken() {
  const mySeq = ++requestSeq;
  const token = await api.refresh();
  if (mySeq !== requestSeq) return; // Stale, discard
  setAccessToken(token);
}

// ❌ Bad: "while we're here" refactoring
// Also renamed variables, extracted helper, changed logging format...
```

### Defensive Patterns Library

```typescript
// Guard clause pattern
function process(input: Input): Result {
  if (!input) throw new ValidationError('Input required');
  if (input.items.length === 0) throw new ValidationError('Items required');
  // ... safe to proceed
}

// Abort controller for stale requests
const abortController = new AbortController();
async function fetchData() {
  abortController.abort();
  abortController = new AbortController();
  const res = await fetch(url, { signal: abortController.signal });
  return res.json();
}

// Retry with backoff
async function withRetry<T>(fn: () => Promise<T>, opts = { retries: 3, baseMs: 1000 }) {
  for (let i = 0; ; i++) {
    try return await fn();
    catch (e) {
      if (i >= opts.retries) throw e;
      await sleep(opts.baseMs * 2 ** i);
    }
  }
}

// Circuit breaker
class CircuitBreaker {
  state: 'closed' | 'open' | 'half-open' = 'closed';
  failures = 0;
  async execute<T>(fn: () => Promise<T>) {
    if (this.state === 'open') throw new Error('Circuit open');
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (e) {
      this.onFailure();
      throw e;
    }
  }
}
```

### Decoupling Checklist
- [ ] No singleton imports in business logic
- [ ] Dependencies injected (constructor/function params)
- [ ] Interfaces defined for external services
- [ ] Repositories abstract data access
- [ ] UI knows nothing about DB/API details

---

## Phase 4: Self Review

### Review Your Own Diff Like a Stranger
1. `git diff` → save to file
2. Read line by line (not skim)
3. Pretend you didn't write it
4. Ask: "How does this break?"

### Time-Box Review
- 15 min for typical PR
- 30 min for complex changes
- Don't skip — catches 30–50% of remaining issues

---

## Phase 5: Verification

### Verification Script Template
```bash
#!/bin/bash
# verify.sh - run after every fix batch
set -e

echo "🔍 Forbidden patterns..."
rg "catch\s*\{\s*\}" src/ && { echo "❌ Empty catch blocks found"; exit 1; }

echo "✅ Required handlers..."
grep -r "requestSequenceToken" src/services/ || { echo "❌ Missing sequence token"; exit 1; }

echo "🧪 Tests..."
npm test

echo "📋 Contracts..."
npm run validate:contracts

echo "✅ All checks passed"
```

### Live Simulation Checklist
- [ ] Backend starts cleanly
- [ ] Frontend loads without console errors
- [ ] Database seeded (not mocked)
- [ ] Original bug trigger reproduced
- [ ] Fix confirmed with same trigger
- [ ] Edge cases tested (empty, error, boundary)
- [ ] Network captures saved

---

## Phase 6: Reporting

### Readiness % Honesty
- Don't inflate — 87% with conditions > 95% with hidden debt
- Document every residual area with tracking ID
- Conditions = monitoring + rollback plan, not "trust me"

### Evidence Organization
```
evidence/
├── dbg-001.har          # Bug reproduction
├── dbg-001-fixed.har    # Fix confirmation
├── e2e-session.webm     # Full workflow
├── network-har-*.json   # All API calls
├── schema-validation.json
├── test-results.xml
└── load-test-results.json
```

---

## General Principles

### Communication
- **Confirm understanding** in 2–4 sentences before Phase 1
- **Present register** before Phase 3 — get alignment
- **Show evidence** not opinions
- **Note deviations** from skill when user directs otherwise

### Tooling
- **agent-browser** for real E2E — captures actual network + UI
- **rg (ripgrep)** for code search — faster than grep
- **jq** for JSON evidence — query HAR files, API responses
- **ts-prune / knip** for dead code detection

### Mindset
- **Root cause > symptom** — Always
- **Real system > theory** — Run it
- **Incremental > big bang** — Verify each step
- **Surgical > sweeping** — Touch only what's broken

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Better Approach |
|--------------|--------------|-----------------|
| "Quick fix" patch | Regresses, hides root cause | Phase 0–2 first |
| Mock data in fixes | False confidence | Build real endpoint |
| Big-bang rewrite | Unverifiable, high risk | Incremental + verify |
| Skip self-review | Ships bugs | 15-min hostile review |
| Theorize verification | Misses integration issues | Run real stack |
| Inflate readiness | Production incidents | Honest residual tracking |