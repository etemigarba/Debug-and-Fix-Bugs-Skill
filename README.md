# debug-and-fix-bugs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blue)](https://claude.ai/code)
[![ECC Compatible](https://img.shields.io/badge/ECC-Compatible-green)](https://github.com/anthropics/claude-code)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/etemi/debug-and-fix-bugs/releases)

Systematic three-phase debugging skill for **Claude Code**: architectural analysis → defect registration → production-ready refactoring with live verification. Root-cause fixes, not band-aids. Zero mock data, defensive control flow, surgical discipline.

**Companion skill:** [`/production-ready-workflow`](https://github.com/etemigarba/Production-Ready-Workflow) for full-app mock-data eradication.

---

## Quick Start

```bash
# In Claude Code, invoke the skill:
/debug-and-fix-bugs
```

Or reference it in your prompt:
> "Debug and fix the authentication flow — users report intermittent 401 errors after token refresh."

---

## When to Use This Skill

Trigger `/debug-and-fix-bugs` when users ask to:
- "debug and fix", "find and fix bugs", "hunt down bugs"
- "fix this broken workflow", "why is this failing"
- "audit the code for bugs / race conditions / bottlenecks"
- Request a **bug-focused refactor** of algorithms, data structures, or workflows
- Report symptoms: crashes, wrong output, slow performance, race conditions, memory issues
- Want **root-cause fixes**, not band-aids

> For full-app mock-data eradication and production-readiness audits, prefer the companion skill **`/production-ready-workflow`**.

---

## The Six-Phase Workflow

| Phase | Name | Purpose |
|-------|------|---------|
| **0** | **Confidence Gate** | Understand before you plan — reproduce, inventory, clarify |
| **1** | **Architectural & Logic Analysis** | Map control/data flow; identify bottlenecks, hidden bugs, race conditions, contract mismatches |
| **2** | **Debugging & Gap Assessment** | Produce prioritized defect register with evidence; flag gaps (missing error paths, unvalidated inputs) |
| **3** | **Production-Ready Refactoring** | Defensive control flow, decoupling, quality bars, surgical discipline |
| **4** | **Senior-Engineer Self Code Review** | Hostile review of own diff — most critical → least critical |
| **5** | **Verification & Live Simulation** | Run real stack, drive actual workflows, capture server responses, reproduce original bugs |
| **6** | **Readiness Report** | Defect register status, production-readiness %, residual areas, verification evidence |

---

## Key Principles

- **Phase 0 gate is mandatory** — clarify before planning, plan before coding
- **Root cause over symptom** — never patch an error message without explaining *why* it occurred
- **Never fabricate** — capture real server responses, stack traces, test results
- **Incremental, verifiable changes** — keep the app runnable between steps
- **Build missing endpoints/schemas** rather than reintroducing mocks
- **Surgical discipline** — change only the exact module/function identified in the defect register

---

## Repository Structure

```
debug-and-fix-bugs/
├── .github/
│   ├── workflows/ci.yml           # CI: skill validation + markdown linting
│   └── ISSUE_TEMPLATE/            # Bug report & feature request templates
├── docs/                          # Phase-by-phase documentation
├── skill/
│   ├── debug-and-fix-bugs.skill   # Binary skill file (for ECC)
│   └── SKILL.md                   # Human-readable skill definition
├── examples/
│   ├── sample-defect-register.md
│   ├── sample-readiness-report.md
│   └── verification-script-template.ts
├── wiki/                          # GitHub Wiki content
├── LICENSE                        # MIT License (c) 2026 Prof. Etemi Joshua Garba
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── package.json                   # npm scripts for validation
└── .gitignore
```

---

## Installation

### Via ECC (Recommended)
```bash
# In your project with ECC configured
ecc install debug-and-fix-bugs
```

### Manual (Claude Code)
1. Copy `skill/debug-and-fix-bugs.skill` to your `.claude/skills/` directory
2. Or reference the skill directly in your prompt with `/debug-and-fix-bugs`

---

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Claude Code** | Latest | Agent runtime |
| **ECC Framework** | Any | Skill orchestration (optional but recommended) |
| **agent-browser skill** | Any | Phase 5 E2E simulation (optional) |
| **Node.js** | 18+ | Verification scripts |
| **Git** | Any | Version control |
| **Playwright / curl** | Any | HTTP flow testing (optional) |

---

## Documentation

- [Phase 0: Confidence Gate](docs/phase-0-confidence-gate.md)
- [Phase 1: Architectural & Logic Analysis](docs/phase-1-architectural-analysis.md)
- [Phase 2: Debugging & Gap Assessment](docs/phase-2-debugging-assessment.md)
- [Phase 3: Production-Ready Refactoring](docs/phase-3-refactoring.md)
- [Phase 4: Senior-Engineer Self Code Review](docs/phase-4-code-review.md)
- [Phase 5: Verification & Live Simulation](docs/phase-5-verification.md)
- [Phase 6: Readiness Report](docs/phase-6-readiness-report.md)
- [Operating Rules](docs/operating-rules.md)

---

## Examples

- [Sample Defect Register](examples/sample-defect-register.md)
- [Sample Readiness Report](examples/sample-readiness-report.md)
- [Verification Script Template](examples/verification-script-template.ts)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## License

MIT License — Copyright (c) 2026 **Prof. Etemi Joshua Garba**

No explicit permission required for adoption, editing, or refactoring of this skill.

---

## Related Skills

| Skill | Description |
|-------|-------------|
| [`production-ready-workflow`](https://github.com/etemigarba/Production-Ready-Workflow) | Full-app mock-data eradication & production hardening |
| [`systematic-implementation`](https://github.com/etemi/systematic-implementation) | Gate-controlled SDLC for any software task |
| [`loop-engineer`](https://github.com/etemi/loop-engineer) | Autonomous agent loops with verification gates |
| [`agent-architecture-audit`](https://github.com/etemi/agent-architecture-audit) | 12-layer diagnostic for agent/LLM applications |