# Contributing to debug-and-fix-bugs

Thank you for improving this skill! This document covers contributing to the **skill itself** (not using it).

## Ways to Contribute

- **Bug reports** — Found an issue in the skill logic or documentation?
- **Feature requests** — New phase, check, or pattern idea?
- **Documentation improvements** — Clarify a phase, add examples, fix typos
- **Example templates** — Real-world defect registers, readiness reports
- **Translations** — Make the skill accessible in other languages
- **Tooling** — Verification script enhancements, CI improvements

## Before You Start

1. Check existing [Issues](../../issues) and [Discussions](../../discussions)
2. For significant changes, open an Issue first to discuss approach
3. **Follow the six-phase workflow** this skill teaches — even for skill changes!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/etemi/debug-and-fix-bugs.git
cd debug-and-fix-bugs

# Install validation dependencies
npm install

# Run validation
npm test
```

## Making Changes

### 1. Skill Logic Changes (`.skill` / `SKILL.md`)

The skill has two representations:
- `skill/SKILL.md` — Human-readable source (edit this)
- `skill/debug-and-fix-bugs.skill` — Binary format for ECC (generated)

**Workflow:**
1. Edit `skill/SKILL.md`
2. Run validation: `npm run validate`
3. The binary `.skill` is generated from `SKILL.md` — do not edit directly

### 2. Documentation Changes (`docs/`, `wiki/`)

- Keep phase docs in sync with `SKILL.md`
- Update examples if phases change
- Run markdown linting: `npm run lint:md`

### 3. Example Templates (`examples/`)

- Must be realistic, not toy examples
- Reference real bug categories from the skill
- Include file/line evidence format

## Pull Request Process

### Branch Naming
```
feat/phase-3-circuit-breaker
fix/phase-0-confidence-calculation
docs/phase-5-verification-script
refactor/skill-frontmatter
chore/update-dependencies
```

### Commit Format (Conventional Commits)
```
feat: add circuit breaker pattern to Phase 3
fix: correct confidence gate percentage calculation
docs: add verification script template to examples
refactor: extract defensive patterns to shared module
```

### PR Description Template
```markdown
## Summary
Brief description of change

## Related Issue
Fixes #123

## Phase Impact
- [ ] Phase 0  - [ ] Phase 1  - [ ] Phase 2
- [ ] Phase 3  - [ ] Phase 4  - [ ] Phase 5
- [ ] Phase 6  - [ ] Operating Rules

## Changes
- Detail 1
- Detail 2

## Testing
- [ ] `npm test` passes
- [ ] Manual verification: [describe]
```

### Required Checks
- `npm test` passes (validation + markdown linting)
- At least one maintainer approval
- No merge conflicts

## Skill Design Principles

When proposing changes to the skill itself, consider:

| Principle | Description |
|-----------|-------------|
| **Backward compatibility** | Existing invocations must keep working |
| **Phase integrity** | Each phase has distinct purpose; don't merge them |
| **Evidence-driven** | New checks must be verifiable against real running systems |
| **Surgical discipline** | Changes should be minimal and targeted |
| **No mock data** | Examples must reflect real debugging scenarios |

## Adding a New Phase Check

If you want to add a check to an existing phase:

1. **Identify the phase** — Which of the 6 phases?
2. **Write the check** — Evidence-based, verifiable, with file/line format
3. **Add to SKILL.md** — In the appropriate phase section
4. **Update docs/** — Corresponding phase documentation
5. **Add to verification script template** — `examples/verification-script-template.ts`
6. **Test** — Run through a real debugging engagement

## Adding a New Phase

**Rarely needed.** The six phases cover the complete debugging lifecycle. Before proposing:
- Which gap does it fill?
- Can it be a check in an existing phase?
- Does it maintain the workflow flow?

If truly needed: follow the same process as above + update all phase numbering.

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be respectful, constructive, and inclusive.

## Maintainer

**Prof. Etemi Joshua Garba** — [GitHub](https://github.com/etemi)

## Recognition

Contributors are recognized in:
- CHANGELOG.md
- GitHub contributors graph
- Release notes

---

## Quick Reference: Validation Commands

```bash
# Full validation (runs in CI)
npm test

# Skill validation only
npm run validate

# Markdown linting only
npm run lint:md

# Check skill frontmatter
node scripts/validate-skill.js
```

## Questions?

Open a [Discussion](../../discussions) or reach out to the maintainer.