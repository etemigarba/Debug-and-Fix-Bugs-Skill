# FAQ

## General Questions

### What's the difference between this skill and `/production-ready-workflow`?

| Aspect | `/debug-and-fix-bugs` | `/production-ready-workflow` |
|--------|----------------------|------------------------------|
| **Focus** | Bugs & correctness | Full-app production readiness |
| **Scope** | Targeted bug fixes | Mock data eradication, dead UX, wiring |
| **Trigger** | "Debug and fix X" | "Make app production-ready" |
| **Companion** | Use for bug-centered work | Use for full-app sweep |

**Rule of thumb:** If the center of gravity is **bugs** → this skill. If it's **mock data/placeholders/production hardening** → companion skill.

### Do I need ECC to use this skill?

**No.** The skill works with plain Claude Code. ECC provides:
- Skill orchestration
- Parallel subagent support
- Shared tooling

But the six-phase workflow runs fine without ECC.

### What languages/frameworks does this support?

**Any.** The skill is language-agnostic. It's been used with:
- TypeScript/JavaScript (React, Next.js, Node, Express)
- Python (FastAPI, Django, Flask)
- Go (Gin, Echo, stdlib)
- Rust (Axum, Actix)
- Java (Spring Boot)
- C# (.NET)
- PHP (Laravel, Symfony)

The principles (control flow, root cause, surgical fixes, live verification) apply universally.

---

## Phase-Specific Questions

### Phase 0: "I can't reproduce the bug locally"

**Options:**
1. **Characterize instead** — Capture exact error, frequency, conditions, logs
2. **Use staging** — Replicate with production-like data
3. **Add observability** — Temporary logging, distributed tracing
4. **Ask user for reproduction script** — They may have steps you're missing

**Never proceed to Phase 1 without at least characterization.**

### Phase 1: "The codebase is huge — where do I start?"

1. **Start from the symptom** — Trace backward from error location
2. **Follow the data** — Input → processing → output
3. **Focus on async boundaries** — Where `await` happens
4. **Use search tools** — `rg` for patterns, not manual browsing
5. **Time-box** — 2 hours max for analysis; present findings, iterate

### Phase 2: "How many defects should be in the register?"

**Quality > quantity.** Typical ranges:
- Simple bug: 1–3 defects
- Complex feature: 5–15 defects
- Legacy audit: 20+ defects

**Every entry must have evidence.** No "I think there might be a race condition here."

### Phase 3: "Can I refactor unrelated code while fixing?"

**No.** Surgical discipline means:
- Change only what the defect register identifies
- No "while we're here" cleanups
- No style fixes outside touched lines
- **Exception:** If a fix requires extracting a utility used in 2+ places, do it

### Phase 4: "Do I really need to review my own code?"

**Yes.** Self-review catches 30–50% of remaining issues. It's mandatory because:
- You know the intent but not the implementation gaps
- Fresh eyes (even your own later) spot different things
- Phase 4 is where critical bugs are caught before verification

### Phase 5: "What if the real stack is hard to run?"

**Make it runnable.** This skill assumes you can:
- Start backend (local DB is fine)
- Start frontend
- Run tests

If you can't, **fix the dev environment first** — that's a GAP-001 blocker.

### Phase 6: "What readiness % is 'good enough'?"

| Context | Minimum |
|---------|---------|
| Internal tool | 75% (Ready with Conditions) |
| Customer-facing | 85% |
| Payments/security | 90% |
| Regulated (medical/finance) | 95% |

**Always document conditions** for <90%.

---

## Technical Questions

### How do I handle a bug that requires a backend change?

**Backend is in scope.** The skill explicitly states:
> "If a fix requires an endpoint or schema that doesn't exist, build it (backend is in scope) rather than reintroducing a mock."

### What if the user wants a "quick fix" instead of root cause?

**Explain the tradeoff.** Per Operating Rule 2: "Root cause over symptom." You can:
1. Explain why quick fix will regress
2. Offer phased approach: quick mitigation + root cause fix
3. Document deviation in Readiness Report (Rule 7)

### Can I use this for performance optimization?

**Yes, but...** This skill treats performance as a bug category (Phase 2 priority: after crashes, races). For pure performance work, consider the `benchmark-optimization-loop` skill.

### How do I verify fixes without a staging environment?

**Local is fine.** The skill requires:
- Local backend + DB
- Local frontend
- Real (not mocked) data flow

Staging is a bonus, not a requirement.

### What if there are no tests?

**Create the verification script.** Phase 5 mandates:
> "Develop a script that validates every task in the checklist"

This script *becomes* the regression test suite.

---

## Integration Questions

### How does this work with git workflow?

```
1. Phase 0–2: Analysis (no code changes)
2. Phase 3: Fix on feature branch
3. Phase 4: Self-review on same branch
4. Phase 5: Verification on same branch
5. Phase 6: Report → PR → merge
```

### Can I parallelize with subagents?

**Yes, with rules:**
- Independent task clusters → separate subagents
- Never parallelize tasks touching same files
- Each subagent gets its own defect subset
- Coordinator merges and runs unified verification

### Does this replace code review?

**No.** This is **self-review** (Phase 4). Human code review still happens at PR time. The skill reduces PR review burden by catching issues earlier.

---

## Troubleshooting

### "The agent keeps asking questions in Phase 0"

**Good!** That means the confidence gate is working. Provide:
- Exact error text (copy-paste)
- Steps to reproduce
- Your tech stack details
- What "fixed" means to you

### "Phase 1 found too many issues"

**Prioritize ruthlessly.** Present top 5–10 by severity. Defer rest to technical debt tracker. Don't try to fix everything in one engagement.

### "Verification script fails but the fix seems right"

**Trust the script.** Common causes:
- Forgot to handle edge case
- Schema validation catches contract drift
- Test reveals integration issue
- Fix introduced new bug

Fix the script failure, don't weaken the script.

### "Readiness % is lower than expected"

**Be honest.** Low % with documented conditions > inflated % with hidden risk. Stakeholders prefer transparency.

---

## Still Have Questions?

- Open a [GitHub Discussion](../../discussions)
- Check [Best Practices](Best-Practices) for pro tips
- Read [Phase Deep Dives](Phase-Deep-Dives) for details
- See [Contributing](Contributing) to improve the skill