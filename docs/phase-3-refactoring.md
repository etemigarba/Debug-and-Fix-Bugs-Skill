# Phase 3: Production-Ready Refactoring

> **Plan, then de-risk. Defensive control flow. Decouple as you fix. Surgical discipline.**

## Purpose

Execute fixes with production-grade quality: defensive patterns, decoupling, quality bars, and surgical precision.

---

## 3.1 Plan, Then De-Risk the Plan

### Task Breakdown
From the defect register, produce:
- **Major tasks** — Architectural changes, new modules, interface definitions
- **Minor tasks** — Function-level fixes, logic corrections
- **Micro tasks** — Variable renames, comment updates, formatting

### Completion-Tracking Checklist
```
[ ] DBG-001: Add request sequence token to auth service
[ ] DBG-001: Implement stale response cancellation
[ ] DBG-002: Add field mapping layer in API client
[ ] DBG-003: Add error logging and surfacing in useAuth
[ ] GAP-001: Add timeout config to API client
[ ] GAP-001: Add bounded retry with backoff for idempotent calls
[ ] GAP-002: Implement error/empty/loading states in UserProfile
```

### Risk Review
List plan items by **product risk (most → least)** with explicit mitigations:

| Task | Risk | Mitigation |
|------|------|------------|
| Add request sequence token | Medium — touches core auth flow | Feature flag `AUTH_SEQUENCE_TOKEN`, incremental rollout |
| Field mapping layer | Low — isolated to API client | Contract tests, fallback to current behavior |
| Timeout/retry logic | Medium — changes network behavior | Config-driven, disabled by default, gradual enable |

### Parallelization Rules
- **Independent task clusters** → separate subagents (Claude Code / Cowork)
- **Never parallelize** tasks touching the same files
- Otherwise → execute sequentially

---

## 3.2 Defensive Control Flow — Design for the Full State Space

### Exception Handling
```typescript
// ✅ Good: try/catch/finally with context
async function refreshToken() {
  try {
    const response = await api.post('/auth/refresh', { token: refreshToken });
    return response.data;
  } catch (error) {
    logger.error('Token refresh failed', { error, userId: currentUser.id });
    throw new AuthError('TOKEN_REFRESH_FAILED', { cause: error });
  } finally {
    releaseTokenLock(); // Always release
  }
}

// ❌ Bad: swallowed error
async function refreshToken() {
  try {
    return await api.post('/auth/refresh');
  } catch {} // Silent failure
}
```

### Guard Clauses
```typescript
// ✅ Good: validate at the edge
function processOrder(order: OrderInput): OrderResult {
  if (!order?.items?.length) throw new ValidationError('Order must have items');
  if (order.items.some(i => i.quantity <= 0)) throw new ValidationError('Quantity must be positive');
  if (order.total > MAX_ORDER_TOTAL) throw new ValidationError('Order total exceeds limit');
  // Inner logic trusts its inputs
}

// ❌ Bad: validation scattered inside
function processOrder(order) {
  const items = order.items || [];
  // ... 50 lines later
  if (items.length === 0) return error;
}
```

### Boundary Conditions
Test and handle explicitly:
- Empty collections, single-element, max-size
- Zero, negative, overflow values
- Unicode, emoji, RTL text
- Timezone/DST transitions
- First/last page, offset limits

### Concurrency Control
```typescript
// ✅ Good: abort controller for stale requests
const controller = new AbortController();
const response = await fetch(url, { signal: controller.signal });
// On new request: controller.abort(); create new controller

// ✅ Good: request sequence token
let requestSeq = 0;
async function fetchData() {
  const mySeq = ++requestSeq;
  const data = await api.get('/data');
  if (mySeq !== requestSeq) return; // Stale, ignore
  setData(data);
}
```

### I/O Failures & Fault Tolerance
```typescript
// ✅ Good: timeout + bounded retry + fallback
const response = await fetchWithRetry('/api/data', {
  timeout: 5000,
  retries: 3,
  backoff: 'exponential',
  fallback: () => getCachedData(),
  onFailure: (error) => logger.warn('API failed, using cache', { error })
});
```

### State Rollback on Failed Mutations
```typescript
// ✅ Good: optimistic update with rollback
async function updateProfile(data) {
  const previous = getCurrentProfile();
  optimisticallyUpdate(data);
  try {
    await api.put('/profile', data);
  } catch (error) {
    rollbackTo(previous); // Data integrity survives partial failure
    throw error;
  }
}
```

---

## 3.3 Decouple As You Fix

### Dependency Injection
```typescript
// ✅ Good: inject dependencies
class AuthService {
  constructor(
    private tokenStore: TokenStore,
    private apiClient: ApiClient,
    private logger: Logger
  ) {}
}

// ❌ Bad: singleton imports deep in call stack
import { tokenStore } from '@/stores/token'; // Hard to test, swap, mock
```

### SOLID & Layered Modularity
```
src/
├── ui/           # Components, hooks, views (React, Vue, etc.)
├── workflow/     # Business logic, state machines, orchestrators
├── data/         # Repositories, API clients, DB access
└── shared/       # Types, utilities, constants
```

A bug fix that leaves tangled coupling **will regress**.

### Extract Reusables
If the same fix appears in 2+ places → extract:
```typescript
// Before: duplicated in 3 components
function formatCurrency(amount: number) { /* ... */ }

// After: shared utility
export { formatCurrency } from '@/shared/currency';
```

---

## 3.4 Quality Bars for Rewritten Code

| Dimension | Standard |
|-----------|----------|
| **Performance** | Target O(1)/O(n) worst case; memory-efficient; sound cache invalidation |
| **Security** | Validate at API boundaries; sanitize outputs; parameterized queries; fail-closed routes; secrets from env only |
| **No Placeholders** | Zero mock-data arrays; zero dead UX; zero inline magic numbers; unified error handling; all 4 resource states rendered |
| **Readability** | Type-safe; semantic names; concise comments only for non-obvious logic |

> For full-app mock-data sweep → hand off to `/production-ready-workflow`

---

## 3.5 Surgical Discipline

- Change **exact module/function** from defect register; isolate everything else
- **Do not delete/clean up** working code outside findings
- Annotate every touched file: which defect(s), what changed, what left untouched
- Update checklist as tasks complete
- **Remove orphaned modules** only after verifying nothing imports them (`grep` / `ts-prune` / `knip`)

---

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Big-bang rewrite | Unverifiable, high regression risk |
| No risk review | Surprise breakage in production |
| Skipping guard clauses | Edge cases become production bugs |
| Leaving coupling | Fix regresses, technical debt compounds |
| Mock data in fixes | False confidence, production surprises |

## Next Phase

With refactoring complete → **[Phase 4: Senior-Engineer Self Code Review](phase-4-code-review.md)**