# AGENTS.md — Aether Browser
# Priority: HIGHEST. Read this entire file before doing anything.

## Project Identity

- Project Name: Aether
- Type: Production-grade web browser
- Foundation: Brave Browser fork (Chromium-based)
- Primary Target: Windows (first), Android (second)
- Repository Root: `aether/`

## What This Project Is

Aether is a real, production-grade browser intended to compete with Chrome, Edge, Brave, Arc, Opera, Safari and Comet. It is not a prototype. It is not a mockup. It is not a concept. Every decision must be made with the intention of shipping to real users.

## Non-Negotiable Rules

1. Never run any command that deletes or discards untracked files, uncommitted changes, or build progress without explicit developer confirmation first. This includes but is not limited to: git clean (any variant — -f, -fd, -fdx, -fX), git reset --hard, git checkout -- <path>, git restore (without --staged on files with uncommitted work), and rm -rf on any directory that is not a known, disposable build output explicitly named in the current prompt (such as a specific out/ directory being intentionally cleaned via clean.ps1). If the workspace appears to need cleanup, stop and describe exactly what would be removed and why, and wait for the developer to confirm before proceeding. Build progress, in-progress patches, and uncommitted work are not disposable.
2. Never generate placeholder code. Every implementation must be production-ready.
3. Never generate fake APIs, mock logic, or stub implementations unless a prompt explicitly requests a stub.
4. Never rewrite code that already works unless the prompt explicitly requests a rewrite.
5. Never modify files outside the scope of the current prompt.
6. Never introduce breaking changes without explaining the impact first.
7. Never skip steps. Never jump ahead to a later batch.
8. Never use emojis anywhere — not in code, comments, documentation, UI text, or commit messages.
9. Always analyze existing architecture before making changes.
10. Always prefer maintainable solutions over clever ones.
11. Always explain what changed, why it changed, and what the risks are when modifying existing code.

## Architecture Decisions (Already Approved — Do Not Revisit)

- Browser foundation: Brave fork (Chromium-based). Tauri was evaluated and rejected.
- UI framework: React 19 + TypeScript via Chromium WebUI system.
- State management: Zustand.
- Animation: Framer Motion.
- Backend services: Rust.
- AI primary model: Claude Opus 4.6 (via Anthropic API).
- AI fallback model: Gemini 3.5 Flash (via Antigravity / Google AI).
- Package manager: pnpm.
- Build system: GN + Ninja (Chromium standard).
- First platform: Windows.
- Second platform: Android.

## Code Quality Standards

- Production-grade code only.
- All TypeScript must be strictly typed. No `any` unless justified in a comment.
- All Rust must compile with zero warnings.
- All C++ modifications must follow Chromium's style guide (2-space indent, Google C++ style).
- All React components must be functional components with hooks.
- No inline styles except where CSS variables are impractical.
- All design values (colors, spacing, radius, typography) must use CSS custom properties defined in `src/webui/src/styles/tokens.css`.

## Design Philosophy

- The browser UI must feel like it was designed by Apple's best product designers.
- Inspiration: Safari, macOS, visionOS, Apple Human Interface Guidelines.
- Rounded corners everywhere. Consistent spacing. Smooth spring animations.
- No neon themes. No gamer aesthetics. No material design. No generic SaaS dashboards.

## Batch System

This project is divided into implementation batches. All prompts are stored in `.aether/prompts/`.
- Do not start a batch until the previous batch is fully verified.
- Do not implement features from a future batch in the current batch.
- Current batch is always specified in the prompt header.
- Scripts that intentionally remove build artifacts (clean.ps1) are the only sanctioned cleanup mechanism, and only for the specific out/ directories they target. No other cleanup commands are sanctioned without explicit, per-instance developer confirmation.

## Model Selection

Use Claude Opus 4.6 for: architecture, Chromium C++ integration, security reviews, complex state management, Rust services, difficult engineering decisions.

Use Gemini 3.5 Flash for: file generation, boilerplate, documentation, UI component implementation, repetitive tasks, configuration files.
