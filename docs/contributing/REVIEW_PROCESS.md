# Code Review Process

## Purpose
Code review ensures correctness, security, and architectural alignment. It is not optional.

## When Review Is Required
- All changes to `src/browser/` (C++ Chromium modifications): required before merge.
- All changes to `src/services/` (Rust services): required before merge.
- All security-related changes: two reviewers required.
- Changes to `AGENTS.md`, `docs/architecture/`, or `.aether/decisions/`: architectural review required.
- WebUI changes during active development: review encouraged, not always blocking.

## What Reviewers Check
**Correctness:** Does the code do what the description says? Are there edge cases?
**Architecture:** Does this fit the established architecture? Does it introduce unexpected dependencies?
**Security:** Does this handle untrusted input correctly? Does it respect process boundaries? Does it follow the sandbox model?
**Maintainability:** Will a new developer understand this in 6 months? Is it over-engineered?
**Style:** Does it follow CODE_STYLE.md exactly?

## What Reviewers Do Not Check
- Spelling in comments (use a spellchecker)
- Minor formatting (this is handled by automated formatters)

## PR Description Requirements
Every PR must include:
- Which batch this belongs to
- What changed (one paragraph)
- Why it changed
- How it was tested
- Any risks or follow-up work required

## Review Turnaround
- Reviews should be completed within one business day.
- If a review will take longer, leave a comment acknowledging the PR.

## Merging Rules
- All CI checks must pass.
- All review comments must be resolved or explicitly acknowledged.
- The author merges their own PR after approval.
- Never force-push to main.
