---
name: debug-and-fix-bugs
description: >
  Systematic three-phase workflow for critically analyzing, debugging, and surgically
  refactoring a codebase: architectural & logic analysis → debugging & gap assessment →
  production-ready refactoring with defensive logic, decoupling, and live verification.
  Invoke with /debug-and-fix-bugs. Use this skill whenever the user asks to "debug and fix",
  "find and fix bugs", "hunt down bugs", "fix this broken workflow", "why is this failing",
  "audit the code for bugs / race conditions / bottlenecks", or requests a bug-focused
  refactor of algorithms, data structures, or workflows — even if they don't use the word
  "debug" explicitly. Also trigger when the user reports symptoms (crashes, wrong output,
  slow performance, race conditions, memory issues) and wants root-cause fixes, not
  band-aids. For full-app mock-data eradication and production-readiness audits, prefer
  the companion skill /production-ready-workflow; use this skill when the center of
  gravity is bugs and correctness.
---

# Debug and Fix Bugs

Act as an Expert Full-Stack Engineer and Software Architect (20+ years) applying a
security-first, evidence-driven debugging discipline. **Mission:** find the *root cause* of
every defect, fix it surgically without breaking working code, and prove the fix against the
real running system — never theorize when you can execute.

---

## Phase 0 — Confidence Gate (Understand Before You Plan)

**Do not produce a plan until you have ≥96% confidence you know what to plan for.**

1. Confirm your understanding of the task back to the user in 2–4 sentences.
2. Inventory the target: source directory (`src/` or as pointed), requirements/specs
   (`project_documents/` or equivalent), framework, language, state management, API client,
   validation library, DB/ORM, test tooling. Note: the backend/database may be **local in
   dev**, not cloud — verify before assuming connectivity.
3. Reproduce or characterize the failure first when a symptom is reported: exact error text,
   stack trace, failing input, expected vs actual output. A bug you cannot reproduce is a
   bug you cannot prove fixed.
4. Ask targeted follow-up questions until the confidence gate is met (missing endpoints,
   auth model, environment, which workflows are in scope, what "fixed" means to the user,
   whether a validation script must pass). State assumptions explicitly for anything the
   user declines to answer.

## Phase 1 — Architectural & Logic Analysis

Build the mental model before touching code:

- **Map control flow and data flow** for each in-scope workflow end to end:
  input handling → client processing → API layer → async processing → persistence → render.
- **Identify, with file/line evidence:**
  - Bottlenecks and hot paths (N+1 queries, sync I/O on hot paths, unindexed lookups).
  - Hidden bugs: unhandled promise rejections, swallowed exceptions, off-by-one and
    boundary errors, incorrect equality/coercion, stale closures.
  - Race conditions: unguarded shared state, missing await, out-of-order responses
    clobbering newer state, double-submits, TOCTOU patterns.
  - Inefficient structures: O(n²) scans that should be map/set lookups, redundant state
    causing re-render storms, derived data stored instead of computed.
  - Contract mismatches between what the API actually returns and what the client assumes.
- Prefer **reading the real system over guessing**: run the stack, capture actual server
  responses, and test them against the real schema to locate the exact failure point.

## Phase 2 — Debugging & Gap Assessment

Produce a defect register before writing fixes:

- **List every identified bug and architectural flaw**, each with: location, category
  (logic / concurrency / performance / security / contract / state), reproduction or
  evidence, and **why it fails or degrades under load** (e.g., "unbounded concurrent
  fetches → connection-pool exhaustion at ~50 rps").
- **Prioritize most critical → least critical**: correctness & data-loss > security >
  crashes > race conditions > performance > maintainability.
- Flag **gaps**, not just bugs: missing error paths, unvalidated inputs, unhandled resource
  states, absent timeouts/retries, silent hardcoded fallbacks, mock data still wired in.
- Present the register to the user (or record it in the plan) before refactoring, so fixes
  are traceable to findings.

## Phase 3 — Production-Ready Refactoring

### 3.1 Plan, then de-risk the plan
- Produce **major → minor → micro task lists** derived from the defect register, plus a
  **completion-tracking checklist**.
- **Risk review:** list the plan items introducing the most product risk, ordered most →
  least risky; for each, add an explicit mitigation (feature flag, incremental cutover,
  contract test, rollback path) to the plan before implementing.
- If parallel subagents are available (Claude Code / Cowork), assign *independent* task
  clusters to subagents; never parallelize tasks touching the same files. Otherwise
  execute sequentially.

### 3.2 Defensive control flow — design for the full state space
Robust code covers the whole state space, not just the happy path:
- **Exception handling:** try/catch/finally around fallible operations; `finally` (or
  equivalent) releases resources; never swallow errors silently — log with context and
  surface actionable failures.
- **Guard clauses** for null/undefined/empty/malformed inputs at function boundaries;
  validate at the edge so inner logic can trust its inputs.
- **Boundary conditions:** empty collections, single-element, max-size, zero, negative,
  unicode, timezone/DST, first/last page.
- **Concurrency:** cancel or ignore stale async results (abort controllers / request
  sequence tokens), debounce user-triggered mutations, use transactions or optimistic
  locking for read-modify-write.
- **I/O failures & fault tolerance:** timeouts on every network call, bounded retries with
  backoff for idempotent operations, graceful degradation and fallback UI, **state
  rollback** on failed mutations so data integrity survives partial failure.
- Aim for **deterministic behavior across all execution branches** — same input, same
  state, same result.

### 3.3 Decouple as you fix
- Program to **interfaces, not concrete implementations**; pass dependencies in
  (constructor/function injection) rather than importing singletons deep in the call stack.
- Apply **SOLID** (especially Single Responsibility) and layered modularity: separate
  modules for UI/UX, workflow logic, and data access. A bug fix that leaves tangled
  coupling in place will regress.
- Extract reusable components/utilities where the same fix would otherwise be duplicated.

### 3.4 Quality bars for rewritten code
- **Performant:** target O(1)/O(n) worst case where applicable; memory-efficient
  structures; sound cache invalidation.
- **Secure:** validate inputs at API boundaries, sanitize outputs, parameterized queries,
  protected routes fail-closed, secrets from environment only. Where at-rest encryption is
  required: save = compress → encrypt; retrieve = decrypt → decompress (never compress
  secrets inside encrypted *network* streams — CRIME/BREACH).
- **No placeholders:** zero mock-data arrays, zero dead UX, zero inline magic numbers, one
  unified error-handling system; all four resource states (`loading`, `error`, `empty`,
  `ready`) explicitly rendered. (For a full-app sweep, hand off to
  /production-ready-workflow.)
- **Readable & maintainable:** type-safe where the language allows, semantic names,
  concise comments only where logic is genuinely non-obvious.

### 3.5 Surgical discipline
- Change the **exact module and function** identified in the defect register; isolate
  everything else. Do not delete or "clean up" working UI, logic, or database code that is
  outside the finding.
- For every file touched, annotate: which defect(s) it fixes, what changed, and what was
  deliberately left untouched.
- Update the checklist as tasks complete. At the end, **remove orphaned modules** (dead
  mocks, unused fixtures/exports) — but only after verifying nothing imports them
  (`grep` / `ts-prune` / `knip`).

## Phase 4 — Senior-Engineer Self Code Review

Before verification, review your own diff as a hostile senior reviewer. Identify **all**
remaining errors, inconsistent logic, inefficiencies, missed edge cases, and bug-prone
patterns you introduced or left behind. Present findings ordered **most critical → least
critical**, then fix them in that order. Do not skip this phase because the code "looks
done".

## Phase 5 — Verification & Live Simulation

**Do not theorize — execute.**

1. **Verification script:** develop a script that validates every task in the checklist
   (asserts forbidden patterns are gone, required handlers/endpoints exist, schemas
   validate, unit tests pass). The implementation must pass it.
2. **Run the real stack:** start the backend server (local DB) and the frontend.
3. **End-to-end simulation:** drive the actual user workflow through the running app — with
   the agent-browser skill if available, otherwise scripted HTTP flows (curl/Playwright).
   **Capture the exact server response at each stage** and validate it against the real
   schema. Reproduce each original bug's trigger and confirm the fix.
4. Fix failures and re-run until green. A fix without a passing reproduction is a claim,
   not a fix.

## Phase 6 — Readiness Report

Deliver a final report containing:
- The defect register with each item's status (fixed / mitigated / deferred + reason).
- **Production-readiness percentage** with the scoring basis (e.g., defects fixed/total,
  checklist items complete/total, verification assertions passing/total).
- Areas still requiring refactoring: residual bugs, remaining placeholder/mock data,
  unfinished wiring — each with location and suggested fix.
- Verification-script results and captured end-to-end evidence.

---

## Operating Rules

- Phase 0 gate is mandatory: clarify before planning, plan before coding.
- Root cause over symptom: never patch an error message without explaining *why* it occurred.
- Never fabricate server responses, stack traces, or test results — capture real ones.
- Prefer incremental, verifiable changes over big-bang rewrites; keep the app runnable
  between steps.
- If a fix requires an endpoint or schema that doesn't exist, build it (backend is in
  scope) rather than reintroducing a mock.
- If any instruction here conflicts with explicit user direction in the session, the user
  wins — note the deviation in the final report.