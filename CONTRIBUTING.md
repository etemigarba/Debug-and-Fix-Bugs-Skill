# Contributing to debug-and-fix-bugs

Thank you for contributing! This skill is part of the **Agentic Engineering Skills** ecosystem for Claude Code.

## Ways to Contribute

- **Bug reports** — Found an issue in the skill logic or documentation?
- **Feature requests** — Have an idea for a new phase, check, or pattern?
- **Documentation improvements** — Clarify a phase, add examples, fix typos
- **Example templates** — Add real-world defect registers, readiness reports
- **Translations** — Help make this skill accessible in other languages

## Before You Start

1. Check existing [Issues](../../issues) and [Discussions](../../discussions)
2. For significant changes, open an Issue first to discuss the approach
3. Follow the **six-phase workflow** this skill teaches — even for skill changes!

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

- Edit `skill/SKILL.md` (human-readable)
- Run validation: `npm run validate`
- The binary `.skill` file is generated from `SKILL.md` — do not edit directly

### 2. Documentation Changes (`docs/`, `wiki/`)

- Keep phase docs in sync with `SKILL.md`
- Update examples if phases change
- Run markdown linting: `npm run lint:md`

### 3. Example Templates (`examples/`)

- Must be realistic, not toy examples
- Reference real bug categories from the skill
- Include file/line evidence format

## Pull Request Process

1. **Branch naming:** `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
2. **Commits:** Conventional Commits format (`feat: add phase 3 checkpoint`)
3. **PR description:** Link related Issue, describe change, note any phase impacts
4. **Checks must pass:** `npm test` (validation + markdown linting)
5. **Review:** At least one maintainer approval

## Skill Design Principles

When proposing changes to the skill itself, consider:

- **Backward compatibility** — Existing invocations must keep working
- **Phase integrity** — Each phase has a distinct purpose; don't merge them
- **Evidence-driven** — New checks must be verifiable against real running systems
- **Surgical discipline** — Changes should be minimal and targeted
- **No mock data** — Examples must reflect real debugging scenarios

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be respectful, constructive, and inclusive.

## Questions?

Open a [Discussion](../../discussions) or reach out to the maintainer: **Prof. Etemi Joshua Garba**