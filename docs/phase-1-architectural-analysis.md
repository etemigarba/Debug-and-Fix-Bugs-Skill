# Phase 1: Architectural & Logic Analysis

> **Build the mental model before touching code.**

## Purpose

Map the complete control flow and data flow for each in-scope workflow, then systematically identify bugs, bottlenecks, and architectural flaws with file/line evidence.

## Workflow Mapping

Trace each workflow **end to end**:

```
Input Handling → Client Processing → API Layer → Async Processing → Persistence → Render
```

For each stage, document:
- **Entry points** (routes, event handlers, message consumers)
- **Data transformations** (validation, normalization, enrichment)
- **Side effects** (DB writes, external API calls, cache updates, events emitted)
- **Exit points** (responses, events, rendered UI)

## Evidence-Based Identification

**Prefer reading the real system over guessing.** Run the stack, capture actual server responses, test against real schemas.

### Categories to Hunt

| Category | What to Look For | Evidence Format |
|----------|------------------|-----------------|
| **Bottlenecks & Hot Paths** | N+1 queries, sync I/O on hot paths, unindexed lookups, unbounded loops | `src/api/users.ts:45` — N+1 query in `getUserWithPosts()` |
| **Hidden Bugs** | Unhandled promise rejections, swallowed exceptions, off-by-one, boundary errors, incorrect equality/coercion, stale closures | `src/hooks/useAuth.ts:78` — catch block swallows error, no logging |
| **Race Conditions** | Unguarded shared state, missing await, out-of-order responses clobbering newer state, double-submits, TOCTOU | `src/components/Form.tsx:112` — no request sequence token, stale response overwrites |
| **Inefficient Structures** | O(n²) scans → map/set lookups, redundant state causing re-renders, derived data stored not computed | `src/utils/search.ts:33` — linear scan of 10k items, should be Map |
| **Contract Mismatches** | API returns `snake_case`, client expects `camelCase`; missing fields; nullable vs required | `src/api/client.ts:22` — assumes `user.id` but API returns `user.user_id` |

## Tools & Techniques

- **Run the stack** — `npm run dev`, `docker compose up`, etc.
- **Capture real responses** — Use browser devtools, `curl`, or agent-browser skill
- **Test against real schema** — Validate actual API responses with Zod/Pydantic
- **Static analysis** — `grep`, `ts-prune`, `knip`, `eslint` for dead code
- **Add temporary logging** — Trace execution paths in development

## Output: Analysis Notes

Document findings as structured notes for Phase 2:

```markdown
## Phase 1 Findings

### Control Flow Map
- Auth flow: `login()` → `refreshToken()` → `retryOriginalRequest()`
- Race window: Lines 45-67 in `auth-service.ts`

### Issues Identified
1. **Race condition** — `src/services/auth.ts:45-67`
   - Category: concurrency
   - Evidence: No request sequence token; concurrent refreshes clobber token
   - Impact: ~5% of refresh attempts under load return stale token

2. **Contract mismatch** — `src/api/user.ts:22`
   - Category: contract
   - Evidence: Client expects `id`, API returns `user_id`
   - Impact: Type error at runtime, user profile fails to render

3. **Swallowed exception** — `src/hooks/useAuth.ts:78`
   - Category: logic
   - Evidence: Empty catch block, no logging, no error surfacing
   - Impact: Silent failures, impossible to debug in production
```

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Guessing without running | Missing real issues, hallucinated bugs |
| Only reading happy path | Missed error branches, edge cases |
| No file/line evidence | Untraceable findings, unfixable bugs |
| Skipping contract validation | Client/server drift, runtime crashes |

## Next Phase

With analysis complete → **[Phase 2: Debugging & Gap Assessment](phase-2-debugging-assessment.md)**