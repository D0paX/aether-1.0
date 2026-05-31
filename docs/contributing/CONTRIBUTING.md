# Contributing to Aether

## Before You Start
- Read AGENTS.md completely. It contains non-negotiable project rules.
- Read docs/architecture/OVERVIEW.md to understand the system.
- Ensure your development environment is set up per docs/development/SETUP_WINDOWS.md.

## Branch Strategy
- Main branch: `main` — always builds, always passes tests.
- Development branches: `batch/XX-description` for batch work.
- Feature branches: `feature/short-description` for individual features.
- Fix branches: `fix/short-description` for bug fixes.
- Never commit directly to `main`.

## Batch System
Aether is developed in ordered batches. Each batch has a defined set of deliverables. A batch is complete only when its verification checklist passes. Do not implement features from future batches in the current batch. See PIPELINE.md for the full batch list.

## Code Standards
- TypeScript: strict mode, no `any` without justification.
- C++: Chromium style guide (2-space indent, Google C++ Style Guide).
- Rust: `rustfmt` formatted, zero Clippy warnings.
- All new files must have a file-level comment stating the file's purpose.
- No placeholder implementations. No mock logic. No TODO-driven development in production code.

## Commit Messages
Follow the convention in docs/contributing/COMMIT_CONVENTION.md exactly.

## Pull Request Requirements
- Every PR must reference the batch it belongs to.
- Every PR must include a description of what changed and why.
- Every PR must pass all CI checks before merge.
- Self-review your diff before requesting review.

## Review Process
- All PRs require at least one review.
- Security-related changes require two reviews.
- Chromium C++ modifications require review by someone familiar with the relevant Chromium subsystem.
