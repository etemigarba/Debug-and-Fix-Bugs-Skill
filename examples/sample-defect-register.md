# Sample Defect Register

> **Template** — Copy this structure for your debugging engagements.

---

## Defect Register: Auth Flow Race Condition

**Project:** E-commerce Platform  
**Engagement:** Intermittent 401 errors after token refresh  
**Date:** 2026-07-31  
**Engineer:** Debug Agent

---

### Bugs

| ID | Location | Category | Title | Evidence | Root Cause | Severity | Status |
|----|----------|----------|-------|----------|------------|----------|--------|
| DBG-001 | `src/services/auth.ts:45-67` | concurrency | Race condition in token refresh | Concurrent `refreshToken()` calls clobber shared `accessToken` state; no request sequencing | Unbounded concurrent fetches → connection-pool exhaustion at ~50 rps; stale response overwrites newer token | Critical | Fixed |
| DBG-002 | `src/api/client.ts:22` | contract | API/client field mismatch (`id` vs `user_id`) | Client expects `user.id`, API returns `user.user_id`; TypeError at runtime | No field mapping layer; direct API response consumption | High | Fixed |
| DBG-003 | `src/hooks/useAuth.ts:78` | logic | Swallowed exception in `useAuth` | Empty `catch {}` block; no logging, no error surfacing to UI | Defensive coding omitted; error boundary not implemented | High | Fixed |
| DBG-004 | `src/utils/validation.ts:15` | security | Email validation regex allows invalid domains | Regex `/.+@.+\..+/` passes `user@invalid`; no TLD validation | Oversimplified regex; no RFC-compliant validator used | Medium | Fixed |
| DBG-005 | `src/services/payment.ts:112` | logic | Idempotency key not generated for retries | Retried payment requests lack `Idempotency-Key` header; duplicate charges possible | Retry logic missing idempotency integration | Critical | Fixed |

---

### Gaps

| ID | Location | Category | Title | Evidence | Suggested Fix | Priority |
|----|----------|----------|-------|----------|---------------|----------|
| GAP-001 | `src/api/client.ts` | resilience | No timeout on external API calls | `fetch()` calls have no timeout; can hang indefinitely | Add 5s timeout + 3 retries with exponential backoff | High |
| GAP-002 | `src/components/UserProfile.tsx` | ux | Missing error/empty/loading states | Component renders nothing for empty `posts` array; no loading skeleton | Implement all 4 resource states (loading, error, empty, ready) | Medium |
| GAP-003 | `src/hooks/useAuth.ts` | observability | No structured logging for auth events | `console.log` only; no correlation IDs, no log levels | Integrate structured logger (pino/winston) with request IDs | Medium |
| GAP-004 | `tests/fixtures/user.ts` | testing | Hardcoded mock user in test fixtures | `export const MOCK_USER = { id: 1, ... }` used in 15 tests | Replace with factory + seeded test database | Low |
| GAP-005 | `src/services/auth.ts:95` | resilience | Token refresh retry lacks circuit breaker | Unbounded retries on persistent failure; cascades to upstream | Add circuit breaker pattern (open/half-open/closed) | Medium |

---

### Prioritization Rationale

1. **DBG-001, DBG-005** — Correctness & data loss (duplicate charges, auth failures)
2. **DBG-002, DBG-003** — Security (field mismatch exposes internals) + crashes (swallowed errors)
3. **DBG-004** — Security (validation bypass)
4. **GAP-001** — Resilience (cascading timeouts)
5. **GAP-005** — Resilience (circuit breaker prevents cascade)
6. **GAP-002** — UX (user-facing feedback)
7. **GAP-003** — Observability (debugging capability)
8. **GAP-004** — Testing (mock data eradication)

---

### Presentation Notes

> **Presented to user before Phase 3 refactoring.**
>
> "Found 5 bugs (2 critical, 2 high, 1 medium) and 5 gaps. Critical bugs involve race condition causing auth failures and missing idempotency enabling duplicate charges. Recommend fixing all bugs first, then addressing high-priority gaps. GAP-004 (mock data) can be deferred to production-ready workflow."

---

## Usage Instructions

1. Copy this template
2. Replace project/engagement details
3. Add one row per bug/gap found in Phase 1
4. Fill all columns with evidence-backed data
5. Present to user before Phase 3
6. Update status column throughout Phase 3–5