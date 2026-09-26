# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-31

### Added
- Initial release of `debug-and-fix-bugs` skill
- Six-phase systematic debugging workflow:
  - Phase 0: Confidence Gate (understand before planning)
  - Phase 1: Architectural & Logic Analysis (control/data flow mapping)
  - Phase 2: Debugging & Gap Assessment (defect register with evidence)
  - Phase 3: Production-Ready Refactoring (defensive control flow, decoupling, surgical discipline)
  - Phase 4: Senior-Engineer Self Code Review (hostile review of own diff)
  - Phase 5: Verification & Live Simulation (real stack, E2E workflows)
  - Phase 6: Readiness Report (defect status, production-readiness %, residual areas)
- Operating Rules for mandatory gates and principles
- Companion skill reference: `/production-ready-workflow`
- Comprehensive documentation in `docs/`
- Example templates in `examples/`:
  - Sample Defect Register
  - Sample Readiness Report
  - Verification Script Template
- GitHub Wiki content in `wiki/`
- CI workflow for skill validation and markdown linting
- MIT License (c) 2026 Prof. Etemi Joshua Garba

### Compatibility
- Compatible with Claude Code + ECC Framework
- Requires Node.js 18+ for verification scripts
- Optional: agent-browser skill for Phase 5 E2E simulation

---

## Versioning

This skill uses semantic versioning:
- **MAJOR**: Breaking changes to phase structure or invocation
- **MINOR**: New checks, phases, or significant enhancements
- **PATCH**: Documentation fixes, typo corrections, example updates

## Release Process

1. Update `CHANGELOG.md` with new version
2. Tag release: `git tag v1.0.0`
3. Push tags: `git push origin --tags`
4. GitHub Release auto-created via CI