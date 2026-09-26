# Phase Deep Dives

Detailed guidance for each of the six phases.

---

## Phase 0: Confidence Gate

### The 96% Rule
Don't plan until you're genuinely confident. This prevents:
- Solving the wrong problem
- Wasted refactoring cycles
- Misaligned expectations

### Reproduction Strategies

| Scenario | Approach |
|----------|----------|
| Intermittent | Add extensive logging; run load test; capture network traces |
| Production only | Replicate in staging with production-like data |
| User-reported | Get exact steps, browser/device, time, error text |
| No error message | Add boundary logging; trace execution paths |

### Inventory Checklist
- [ ] Source directory structure
- [ ] Framework + version
- [ ] Language + version
- [ ] State management solution
- [ ] API client + version
- [ ] Validation library
- [ ] Database + ORM
- [ ] Test tooling + commands
- [ ] Local vs cloud services
- [ ] Auth model
- [ ] Deployment target

---

## Phase 1: Architectural & Logic Analysis

### Control Flow Mapping Technique

```
1. Identify entry points (routes, handlers, consumers)
2. Trace each path to exit (response, event, render)
3. Mark: transformations, side effects, async boundaries
4. Note: error paths, retry logic, fallbacks
```

### Evidence Collection Commands

```bash
# Find N+1 queries
rg "await.*findMany" --glob "*.ts" -A 3 -B 3

# Find swallowed exceptions
rg "catch\s*\{\s*\}" --glob "*.ts"

# Find missing awaits
rg "Promise\s*\(" --glob "*.ts" | rg -v "await"

# Find hardcoded fallbacks
rg "(MOCK_|mockData|fallback\s*=\s*\[)" --glob "*.ts"

# Find contract mismatches
# Compare API response types vs client usage
```

### Analysis Output Format

```markdown
## Phase 1 Findings

### Workflow: User Checkout
**Entry:** `POST /api/checkout` → `CheckoutService.execute()`
**Paths:**
1. Validate → Calculate → Create Payment Intent → Confirm → Fulfill
2. Error: Validation → 400 response
3. Error: Payment → Compensate → 500 response

### Issues
1. **Race condition** — `src/services/payment.ts:89`
   - Category: concurrency
   - Evidence: No idempotency key; concurrent confirms create duplicate charges
   - Impact: ~2% of orders under load
```

---

## Phase 2: Debugging & Gap Assessment

### Defect Register Template

| Field | Required | Example |
|-------|----------|---------|
| ID | Yes | DBG-001 |
| Location | Yes | src/services/payment.ts:89 |
| Category | Yes | concurrency |
| Title | Yes | Missing idempotency on payment confirm |
| Evidence | Yes | Concurrent confirms → duplicate Stripe charges |
| Root Cause | Yes | No idempotency key generated; Stripe allows duplicate |
| Severity | Yes | Critical |
| Status | Yes | Open |

### Prioritization Matrix

```
Correctness/Data Loss → Security → Crashes → Race Conditions → Performance → Maintainability
```

### Gap Categories to Flag

- Missing error paths (429, 503, timeout)
- Unvalidated inputs (negative values, oversized payloads)
- Unhandled resource states (loading/error/empty)
- Absent timeouts/retries
- Silent hardcoded fallbacks
- Mock data in production paths

---

## Phase 3: Production-Ready Refactoring

### Task Breakdown Hierarchy

```
Major: New idempotency service
  Minor: Idempotency key generation
    Micro: Add crypto.randomUUID import
    Micro: Store key in Redis with TTL
  Minor: Payment confirm integration
    Micro: Pass key to Stripe API
    Micro: Handle idempotency conflict error
```

### Risk Review Template

| Task | Risk | Mitigation |
|------|------|------------|
| New idempotency service | Medium — new dependency | Feature flag; incremental rollout |
| Stripe API change | Low — isolated | Contract test; fallback to current |

### Defensive Patterns Checklist

- [ ] Try/catch/finally on all fallible operations
- [ ] Guard clauses at function boundaries
- [ ] Boundary conditions tested (empty, zero, max, unicode)
- [ ] Concurrency: abort controllers, sequence tokens
- [ ] Timeouts on ALL network calls
- [ ] Bounded retries with backoff
- [ ] State rollback on failed mutations
- [ ] Dependency injection (no deep singleton imports)
- [ ] SOLID: single responsibility per module

---

## Phase 4: Senior-Engineer Self Code Review

### Review Order (Critical → Low)

1. **Correctness** — Logic errors, off-by-one, inverted conditions
2. **Security** — Unvalidated input to DB/exec, secrets in logs
3. **Data Integrity** — Missing transactions, no rollback
4. **Concurrency** — New races, missing locks
5. **Error Handling** — Swallowed errors, missing context
6. **Performance** — N+1, missing indexes, memory leaks
7. **Contracts** — API/client drift, broken schemas
8. **Edge Cases** — Empty, null, boundaries, timezone
9. **Coupling** — New concrete deps, circular deps
10. **Duplication** — Copy-paste instead of extract
11. **Naming** — Misleading, abbreviations
12. **Formatting** — Style, imports, dead code

### Hostile Reviewer Questions

- "How does this break under load?"
- "What happens if this network call hangs?"
- "Can this be called with null?"
- "What if two requests hit this simultaneously?"
- "Where is the rollback if this fails halfway?"

---

## Phase 5: Verification & Live Simulation

### Verification Script Essentials

```typescript
const checks = [
  // Forbidden patterns gone
  () => !grep('catch.*{}', 'src/**/*.ts'),
  // Required handlers exist
  () => exists('src/services/auth.ts', 'requestSequenceToken'),
  // Schemas validate
  () => validateContract('user.json'),
  // Tests pass
  () => execSync('npm test'),
];
```

### E2E Simulation Options

| Tool | Best For |
|------|----------|
| agent-browser | Real browser, complex UI flows |
| Playwright | Headless, CI-friendly |
| curl + jq | API-only, fast iteration |
| k6 | Load testing |

### Bug Reproduction Checklist

For EACH defect in register:
- [ ] Exact trigger reproduced
- [ ] Pre-fix behavior confirmed
- [ ] Fix applied
- [ ] Post-fix behavior confirmed
- [ ] Evidence captured (HAR, logs, screenshots)

---

## Phase 6: Readiness Report

### Production-Readiness Formula

```
Readiness % = 0.30×(Defects Fixed) + 0.25×(Checklist Complete) + 0.25×(Verification Passing) + 0.20×(Residual Risk)
```

### Thresholds

| Score | Status | Action |
|-------|--------|--------|
| ≥90% | Ready | Deploy with confidence |
| 75–89% | Ready with Conditions | Deploy with documented mitigations |
| <75% | Not Ready | Address critical gaps first |

### Report Must Include

- Defect register with status
- Readiness % with scoring basis
- Residual areas + tracking IDs
- Verification evidence summary
- Sign-off matrix

---

## Cross-Phase Principles

| Principle | Applies To |
|-----------|------------|
| Evidence over opinion | All phases |
| Incremental, verifiable | Phases 3–5 |
| Surgical discipline | Phase 3 |
| User direction wins | All phases |
| No fabrication | All phases |