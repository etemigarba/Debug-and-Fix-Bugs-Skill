# Operating Rules

> **Non-negotiable principles that govern every debugging engagement.**

---

## Rule 1: Phase 0 Gate is Mandatory

**Clarify before planning, plan before coding.**

- No plan produced until ≥96% confidence achieved
- Reproduction is not optional — a bug you cannot reproduce is a bug you cannot prove fixed
- All assumptions stated explicitly for unanswered questions

---

## Rule 2: Root Cause Over Symptom

**Never patch an error message without explaining *why* it occurred.**

- Surface errors are clues, not causes
- Every fix must include root cause analysis in the defect register
- If you don't know why it fails, you haven't fixed it

---

## Rule 3: Never Fabricate

**Capture real server responses, stack traces, and test results.**

- No mock responses in analysis or verification
- No invented stack traces
- No theoretical test results — run the actual tests

---

## Rule 4: Incremental, Verifiable Changes

**Prefer incremental, verifiable changes over big-bang rewrites; keep the app runnable between steps.**

- Each step must be independently verifiable
- App must run after every change
- Rollback must be trivial at every step

---

## Rule 5: Build Missing Endpoints/Schemas

**If a fix requires an endpoint or schema that doesn't exist, build it (backend is in scope) rather than reintroducing a mock.**

- Mock data is technical debt
- Backend changes are in scope for this skill
- Mock reintroduction requires explicit user approval + documentation

---

## Rule 6: Surgical Discipline

**Change the exact module and function identified in the defect register; isolate everything else.**

- Do not delete or "clean up" working UI, logic, or database code outside findings
- Annotate every touched file: which defect(s), what changed, what left untouched
- Remove orphaned modules only after verifying nothing imports them

---

## Rule 7: User Direction Wins

**If any instruction here conflicts with explicit user direction in the session, the user wins — note the deviation in the final report.**

- User intent supersedes skill defaults
- Deviations documented in Readiness Report
- Skill is a framework, not a straitjacket

---

## Rule 8: Verification is Execution

**Do not theorize — execute.**

- Verification script must pass
- Real stack must run
- E2E simulation must reproduce original bug triggers
- A fix without passing reproduction is a claim, not a fix

---

## Rule 9: Evidence Over Opinion

**Every finding, fix, and verification must have file/line evidence.**

- "I think there's a race condition" → ❌
- "Race condition at `src/auth.ts:45` — concurrent refreshes clobber token, no sequence token" → ✅

---

## Rule 10: No Placeholders in Production Code

**Zero mock-data arrays, zero dead UX, zero inline magic numbers, one unified error-handling system; all four resource states (`loading`, `error`, `empty`, `ready`) explicitly rendered.**

- Mock data → hand off to `/production-ready-workflow`
- Dead UX → retire with evidence
- Magic numbers → extract to constants with semantic names

---

## Rule Summary Card

| # | Rule | Key Phrase |
|---|------|------------|
| 1 | Phase 0 Gate | Clarify → Plan → Code |
| 2 | Root Cause | Why, not what |
| 3 | No Fabrication | Real evidence only |
| 4 | Incremental | Runnable at every step |
| 5 | Build, Don't Mock | Backend in scope |
| 6 | Surgical | Exact module, isolate rest |
| 7 | User Wins | Document deviations |
| 8 | Verify by Execution | Run it, don't guess |
| 9 | Evidence Required | File:line or it didn't happen |
| 10 | No Placeholders | Production-ready or defer |

---

## Enforcement

These rules are enforced through:
- **Phase gates** — Cannot proceed without meeting criteria
- **Self-review (Phase 4)** — Hostile review catches violations
- **Verification (Phase 5)** — Execution proves compliance
- **Readiness Report (Phase 6)** — Documents adherence and deviations

---

## When Rules Conflict

1. **User direction** (Rule 7) > All other rules
2. **Safety/Security** (Rules 2, 3, 9) > Velocity
3. **Evidence** (Rule 9) > Assumptions
4. **Incremental** (Rule 4) > Completeness

When in doubt: **Ask the user**, document the decision, proceed incrementally.