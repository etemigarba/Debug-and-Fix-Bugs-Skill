# Phase 2: Debugging & Gap Assessment

> **Produce a defect register before writing fixes.**

## Purpose

Transform Phase 1 findings into a prioritized, evidence-backed defect register. Flag gaps (missing error paths, unvalidated inputs) alongside bugs. Present to user before refactoring for traceability.

## Defect Register Format

Each entry must include:

| Field | Description | Example |
|-------|-------------|---------|
| **ID** | Unique identifier | `DBG-001` |
| **Location** | File:line or module | `src/services/auth.ts:45-67` |
| **Category** | logic / concurrency / performance / security / contract / state | `concurrency` |
| **Title** | Concise description | `Race condition in token refresh` |
| **Evidence** | Reproduction steps or static analysis proof | `Concurrent refreshes clobber token; no request sequence token` |
| **Root Cause** | Why it fails/degrades under load | `Unbounded concurrent fetches → connection-pool exhaustion at ~50 rps` |
| **Severity** | Critical / High / Medium / Low | `High` |
| **Status** | Open / In Progress / Fixed / Mitigated / Deferred | `Open` |

## Prioritization Order

**Most critical → Least critical:**

1. **Correctness & Data Loss** — Wrong results, lost writes, corruption
2. **Security** — Auth bypass, injection, data exposure
3. **Crashes** — Unhandled exceptions, process termination
4. **Race Conditions** — Intermittent corruption, stale state
5. **Performance** — Degradation under load, resource exhaustion
6. **Maintainability** — Technical debt, coupling, unclear code

## Gap Categories (Beyond Bugs)

Flag these even if not "bugs" yet:

| Gap Type | Example |
|----------|---------|
| **Missing error paths** | No handling for 429 Too Many Requests |
| **Unvalidated inputs** | API accepts negative `pageSize` |
| **Unhandled resource states** | No `loading`/`empty`/`error` UI states |
| **Absent timeouts/retries** | External API call hangs indefinitely |
| **Silent hardcoded fallbacks** | `const FALLBACK_USER = { id: 1 }` in production code |
| **Mock data still wired in** | `if (process.env.NODE_ENV !== 'production') return MOCK_DATA` |

## Presenting the Register

Before Phase 3, present the register to the user (or record in plan):

```markdown
## Defect Register (Pre-Refactoring)

| ID | Location | Category | Title | Severity | Status |
|----|----------|----------|-------|----------|--------|
| DBG-001 | src/services/auth.ts:45-67 | concurrency | Race condition in token refresh | High | Open |
| DBG-002 | src/api/user.ts:22 | contract | API/client field mismatch (id vs user_id) | High | Open |
| DBG-003 | src/hooks/useAuth.ts:78 | logic | Swallowed exception in useAuth | Medium | Open |
| GAP-001 | src/api/client.ts | gap | No timeout on external API calls | Medium | Open |
| GAP-002 | src/components/UserProfile.tsx | gap | Missing error/empty states | Low | Open |

**Total: 3 bugs, 2 gaps**
```

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Skipping the register | Untraceable fixes, scope creep |
| Mixing bugs and gaps | Unclear priority, missed root causes |
| No root cause analysis | Symptom patching, regression |
| Not presenting to user | Misaligned priorities, surprise changes |

## Next Phase

With register approved → **[Phase 3: Production-Ready Refactoring](phase-3-refactoring.md)**