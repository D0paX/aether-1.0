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

1. Never generate placeholder code. Every implementation must be production-ready.
2. Never generate fake APIs, mock logic, or stub implementations unless a prompt explicitly requests a stub.
3. Never rewrite code that already works unless the prompt explicitly requests a rewrite.
4. Never modify files outside the scope of the current prompt.
5. Never introduce breaking changes without explaining the impact first.
6. Never skip steps. Never jump ahead to a later batch.
7. Never use emojis anywhere — not in code, comments, documentation, UI text, or commit messages.
8. Always analyze existing architecture before making changes.
9. Always prefer maintainable solutions over clever ones.
10. Always explain what changed, why it changed, and what the risks are when modifying existing code.

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

## Model Selection

Use Claude Opus 4.6 for: architecture, Chromium C++ integration, security reviews, complex state management, Rust services, difficult engineering decisions.

Use Gemini 3.5 Flash for: file generation, boilerplate, documentation, UI component implementation, repetitive tasks, configuration files.
