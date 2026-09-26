# Getting Started

## Installation

### Via ECC (Recommended)
```bash
ecc install debug-and-fix-bugs
```

### Manual (Claude Code)
1. Copy `skill/debug-and-fix-bugs.skill` to your `.claude/skills/` directory
2. Or reference directly in your prompt

## Invocation

In Claude Code, simply invoke:
```
/debug-and-fix-bugs
```

Or describe the problem naturally:
> "Users report intermittent 401 errors after token refresh. Debug and fix the authentication flow."

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Claude Code | Latest | Agent runtime |
| ECC Framework | Any | Optional but recommended |
| Node.js | 18+ | For verification scripts |
| Git | Any | Version control |
| agent-browser skill | Any | Optional: for Phase 5 E2E |

## First Run Walkthrough

### 1. Describe the Symptom
> "The checkout flow fails intermittently with 'Payment intent requires confirmation' but only under load."

### 2. Phase 0: Confidence Gate
The agent will:
- Confirm understanding back to you
- Inventory your tech stack (framework, language, DB, etc.)
- Ask targeted questions to reach ≥96% confidence
- **You must reproduce or characterize the failure**

### 3. Phase 1: Analysis
The agent maps control/data flow and identifies issues with file/line evidence.

### 4. Phase 2: Defect Register
You'll receive a prioritized register like:
| ID | Title | Severity |
|----|-------|----------|
| DBG-001 | Race condition in payment confirmation | Critical |
| DBG-002 | Missing idempotency on retry | Critical |
| GAP-001 | No timeout on Stripe API | High |

### 5. Phase 3–5: Fix & Verify
The agent implements fixes surgically, reviews own code, and runs live verification.

### 6. Phase 6: Readiness Report
You get a report with:
- Defect status (fixed/mitigated/deferred)
- Production-readiness percentage (e.g., 87%)
- Residual areas with tracking IDs
- Verification evidence

## Tips for Best Results

1. **Provide access** to the real running system (local dev is fine)
2. **Share error logs**, stack traces, failing requests
3. **Define "fixed"** clearly (zero errors? <0.1%? specific SLA?)
4. **Be available** for Phase 0 clarification questions
5. **Review the defect register** before Phase 3 starts

## Common First-Run Issues

| Issue | Solution |
|-------|----------|
| "I can't reproduce locally" | Agent will help characterize; use staging if needed |
| "Backend is in cloud" | Agent works with any accessible endpoint |
| "No tests exist" | Agent creates verification script from scratch |
| "Too many bugs" | Agent prioritizes; you decide scope |

## Next Steps

- Read [Phase Deep Dives](Phase-Deep-Dives) for each phase details
- Check [Best Practices](Best-Practices) for pro tips
- See [FAQ](FAQ) for common questions