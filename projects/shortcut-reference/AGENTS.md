# AGENTS.md — Cursor & coding agents

Read this together with [CLAUDE.md](CLAUDE.md).

## Scope

- Work from the repository root unless a task says otherwise.
- Prefer **small commits** with clear messages.

## Conventions

1. **Match existing Swift/SwiftUI style** when code exists.
2. **Update CHANGELOG.md** under `## [Unreleased]` for features, fixes, breaking changes, or important refactors.
3. **Learning-friendly:** prefer a short note in [docs/LEARNING.md](docs/LEARNING.md) over long comment blocks in code.
4. **No drive-by refactors** unrelated to the task.
5. **Portfolio:** when shipping something visible, update [README.md](README.md) “Portfolio snapshot” / “How to run” and [docs/CASE_STUDY.md](docs/CASE_STUDY.md) as appropriate.

## Files to touch when…

| Situation | Update |
|-----------|--------|
| Architecture or modules change | `docs/ARCHITECTURE.md` |
| Significant technical choice | new file in `docs/adr/` |
| Milestones shift | `ROADMAP.md` |
| User-visible release | `CHANGELOG.md` + bump version section when cutting a release |

## Xcode

When `.xcodeproj` exists: document non-default schemes or destinations in README.
