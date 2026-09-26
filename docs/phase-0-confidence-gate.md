# Phase 0: Confidence Gate — Understand Before You Plan

> **Mandatory gate** — Do not produce a plan until you have **≥96% confidence** you know what to plan for.

## Purpose

Prevent premature planning by forcing explicit understanding, reproduction, and clarification before any code changes.

## The Four Steps

### 1. Confirm Understanding (2–4 sentences)
Echo back the task in your own words. This surfaces mismatches immediately.

> **Example:** "You're seeing intermittent 401 errors after token refresh in the authentication flow. The issue occurs when multiple API calls fire simultaneously after a refresh, and some requests use the old token. You want the root cause fixed, not a retry wrapper."

### 2. Inventory the Target
Document the technical landscape before diving in:

| Category | Details to Capture |
|----------|-------------------|
| **Source directory** | `src/`, `apps/`, `packages/` — whatever the user points to |
| **Requirements/specs** | `project_documents/`, `docs/`, `SPEC.md`, API contracts |
| **Framework** | Next.js, React, Vue, Express, FastAPI, Django, etc. |
| **Language** | TypeScript, Python, Go, Rust, etc. |
| **State management** | Redux, Zustand, Context, Signals, TanStack Query, etc. |
| **API client** | fetch, axios, ky, tRPC, GraphQL client |
| **Validation library** | Zod, Yup, Valibot, Pydantic, Joi |
| **DB/ORM** | Prisma, Drizzle, SQLAlchemy, TypeORM, raw SQL |
| **Test tooling** | Vitest, Jest, Playwright, Cypress, pytest |

> **Critical:** The backend/database may be **local in dev**, not cloud. Verify connectivity before assuming.

### 3. Reproduce the Failure
A bug you cannot reproduce is a bug you cannot prove fixed. Capture:

- **Exact error text** (full message, not paraphrased)
- **Stack trace** (complete, not truncated)
- **Failing input** (request payload, user action, environment state)
- **Expected vs actual output** (what should happen vs what happens)
- **Frequency** (always, intermittent, under load, specific conditions)

### 4. Ask Targeted Follow-up Questions
Keep asking until the confidence gate is met. Common areas:

- **Missing endpoints** — Does the API exist? What's the contract?
- **Auth model** — JWT, session, API key, OAuth? Token refresh flow?
- **Environment** — Local, staging, prod? Docker, bare metal, serverless?
- **Scope** — Which workflows are in/out of scope?
- **Definition of "fixed"** — Zero errors? <1% error rate? Specific SLA?
- **Validation script** — Must a specific test pass? CI gate?

**State assumptions explicitly** for anything the user declines to answer.

## Confidence Checklist

Before proceeding to Phase 1, confirm:

- [ ] Task confirmed back to user in 2–4 sentences
- [ ] Full technical inventory documented
- [ ] Failure reproduced or characterized with evidence
- [ ] All follow-up questions answered or assumptions stated
- [ ] Confidence ≥ 96%

## Common Pitfalls

| Pitfall | Consequence |
|---------|-------------|
| Skipping reproduction | Fixing the wrong thing, phantom fixes |
| Assuming cloud backend | Wasted time on connectivity issues |
| Vague "fixed" definition | Misaligned expectations, scope creep |
| Not stating assumptions | Silent disagreements, rework |

## Next Phase

Once the gate is passed → **[Phase 1: Architectural & Logic Analysis](phase-1-architectural-analysis.md)**