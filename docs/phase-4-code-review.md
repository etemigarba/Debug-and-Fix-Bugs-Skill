# Phase 4: Senior-Engineer Self Code Review

> **Before verification, review your own diff as a hostile senior reviewer.**

## Purpose

Catch remaining errors, inconsistent logic, inefficiencies, missed edge cases, and bug-prone patterns you introduced or left behind. Present findings **most critical → least critical**, then fix in that order.

## The Hostile Reviewer Mindset

Ask of every change:
- **"How does this break?"** — Not "does it work?"
- **"What did I miss?"** — Not "what did I fix?"
- **"Where is the technical debt?"** — Not "is it clean?"

## Review Checklist

### Critical (Must Fix Before Verification)

| Check | What to Look For |
|-------|------------------|
| **Correctness** | Logic errors, off-by-one, wrong condition, inverted boolean |
| **Security** | Unvalidated input reaching DB/exec, secrets in logs, XSS vectors |
| **Data Integrity** | Missing transactions, lost updates, no rollback on failure |
| **Concurrency** | New race conditions introduced, missing locks/sequence tokens |
| **Error Handling** | Swallowed errors, missing context in logs, unactionable messages |

### High (Fix Before Merge)

| Check | What to Look For |
|-------|------------------|
| **Performance** | N+1 introduced, missing indexes, unbounded memory growth |
| **Contracts** | API/client drift, missing field mappings, broken schemas |
| **Edge Cases** | Empty arrays, null inputs, boundary values, timezone issues |
| **Resource Leaks** | Unclosed connections, uncleared timers, unreleased locks |

### Medium (Address in Follow-up)

| Check | What to Look For |
|-------|------------------|
| **Coupling** | New concrete dependencies, singleton imports, circular deps |
| **Duplication** | Same fix copied instead of extracted |
| **Naming** | Misleading names, abbreviations, inconsistent conventions |
| **Comments** | Obsolete comments, missing context for non-obvious logic |

### Low (Nice to Have)

| Check | What to Look For |
|-------|------------------|
| **Formatting** | Inconsistent style, line length, import order |
| **Dead Code** | Unused imports, unreachable branches, orphaned modules |
| **Type Safety** | `any` types, missing generics, loose inference |

## Review Process

1. **Generate diff** — `git diff` or GitHub PR view
2. **Read line by line** — Not skim; every added/changed line
3. **Annotate findings** — File, line, severity, description
4. **Prioritize** — Critical → High → Medium → Low
5. **Fix in order** — Don't skip critical because "it looks done"
6. **Re-review** — After fixes, review again

## Output: Review Findings

```markdown
## Self Code Review — Phase 4 Findings

### Critical (2)
1. **src/services/auth.ts:89** — Missing null check on `refreshToken` before use
   - Severity: Critical (crash)
   - Fix: Add guard clause, return early with AuthError

2. **src/api/client.ts:45** — Timeout config not applied to retry attempts
   - Severity: Critical (unbounded retry hangs)
   - Fix: Pass timeout to each retry attempt

### High (3)
3. **src/hooks/useAuth.ts:112** — No cleanup of abort controller on unmount
   - Severity: High (memory leak)
   - Fix: Use useEffect cleanup

4. **src/components/UserProfile.tsx:33** — Empty state not handled for `user.posts`
   - Severity: High (UI shows nothing, no feedback)
   - Fix: Add empty state rendering

5. **src/utils/validation.ts:21** — Email regex allows invalid TLDs
   - Severity: High (data quality)
   - Fix: Use RFC-compliant validator or library

### Medium (2)
6. **src/services/auth.ts** — Imports `logger` from concrete implementation
   - Severity: Medium (coupling)
   - Fix: Inject logger interface

7. **src/hooks/useAuth.ts** — Duplicate token parsing logic (also in api/client.ts)
   - Severity: Medium (duplication)
   - Fix: Extract to shared/utils/token.ts

### Low (1)
8. **src/api/client.ts** — Inconsistent import order
   - Severity: Low
   - Fix: Run prettier/eslint --fix
```

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Skipping self-review | Bugs ship to verification, waste cycles |
| Only checking "happy path" | Edge cases missed, production failures |
| Fixing low-severity first | Critical issues linger, false progress |
| Not re-reviewing after fixes | New bugs introduced during fix |

## Next Phase

With review complete and critical/high fixed → **[Phase 5: Verification & Live Simulation](phase-5-verification.md)**