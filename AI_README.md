# AI_README.md — Aether Browser
# Read this file if you are an AI coding agent (Claude, Gemini, Codex, or any future agent).

## Reading Order

Read these files in this exact order before doing any work:

1. `AGENTS.md` — Non-negotiable project rules and architecture decisions.
2. `AI_README.md` — This file. Repository orientation for AI agents.
3. `KNOWLEDGE_INDEX.md` — Master index of all knowledge and reference sources.
4. `SOURCE_CLASSIFICATION.md` — Classification of every external source in the repository.
5. `.aether/knowledge/AI_USAGE.md` — Detailed agent-specific usage guidance.

## Repository Zones

This repository is divided into five distinct zones. Every file and directory
belongs to exactly one zone. Understanding these zones is critical.

### Zone 1: Production Code (AUTHORITATIVE — Aether owns this)

These directories contain Aether's production source code. This is what ships
to users. Modifications here require the highest standard of quality.

| Directory | Contents |
|---|---|
| `src/browser/` | Chromium browser process modifications |
| `src/webui/` | React 19 + TypeScript WebUI frontend |
| `src/services/` | Rust backend services (ai-service, sync-service) |
| `android/` | Android platform wrapper |
| `extensions/` | Extension API, SDK, and examples |

### Zone 2: Documentation (AUTHORITATIVE — Aether owns this)

| Directory | Contents |
|---|---|
| `docs/architecture/` | System architecture documentation |
| `docs/development/` | Developer setup and build guides |
| `docs/contributing/` | Contribution guidelines |
| `docs/api/` | API documentation |

### Zone 3: AI Knowledge (AUTHORITATIVE — Aether owns this)

| Directory | Contents |
|---|---|
| `.aether/knowledge/` | Curated reference index with structured documentation |
| `.aether/prompts/` | Implementation batch prompts |
| `.aether/decisions/` | Architectural decision records |
| `.aether/tools/` | Custom development tools |

### Zone 4: Research Sources (READ-ONLY — External projects)

| Directory | Contents |
|---|---|
| `.aether/research/` | Cloned external repositories for reference |

**Rules for Zone 4:**
- NEVER modify any file in `.aether/research/`.
- NEVER copy code from research sources into production code.
- NEVER import or require files from research sources.
- These repositories exist for reading and learning only.
- They are excluded from Aether's git history via `.gitignore`.

### Zone 5: Project Infrastructure (AUTHORITATIVE — Aether owns this)

| File/Directory | Contents |
|---|---|
| `tools/` | Build scripts, GN config, Chromium patches |
| `tests/` | Test suites (browser, webui, integration, e2e, performance) |
| `.github/` | GitHub Actions workflows |
| `.vscode/` | Shared VS Code configuration |

## What to Read First (By Task Type)

| Task | Read First | Then Read |
|---|---|---|
| Any task | `AGENTS.md` | This file |
| UI component work | `.aether/knowledge/references/design/INDEX.md` | `.aether/knowledge/references/ui-libraries/INDEX.md` |
| Animation work | `.aether/knowledge/references/animation/framer-motion.md` | `.aether/knowledge/references/design/apple-hig.md` |
| Browser C++ work | `.aether/knowledge/references/browser/chromium-source.md` | `.aether/knowledge/references/browser/brave-browser.md` |
| Architecture decisions | `.aether/knowledge/INDEX.md` | `SOURCE_CLASSIFICATION.md` |
| New batch start | `.aether/prompts/batch-NN-*/` | `.aether/knowledge/INDEX.md` |

## What to Never Do

1. Never treat research sources as production code.
2. Never modify files outside the scope of the current prompt.
3. Never copy code from `.aether/research/` into `src/`.
4. Never reference `.aether/research/` paths in production imports.
5. Never commit research sources to Aether's git history.
6. Never skip reading `AGENTS.md` before starting work.

## Context Loading Priority

When an agent has limited context window, load files in this priority order:

### Claude Opus 4.6 (Architecture, C++, Rust, Security)
1. `AGENTS.md`
2. `.aether/knowledge/references/browser/chromium-source.md`
3. `.aether/knowledge/references/browser/brave-browser.md`
4. `.aether/knowledge/AI_USAGE.md`
5. `SOURCE_CLASSIFICATION.md`
6. `.aether/knowledge/references/animation/framer-motion.md`

### Gemini 3.5 Flash (UI, Boilerplate, Documentation)
1. `AGENTS.md`
2. `.aether/knowledge/references/design/apple-hig.md`
3. `.aether/knowledge/references/animation/framer-motion.md`
4. `.aether/knowledge/references/ui-libraries/INDEX.md`
5. `.aether/knowledge/AI_USAGE.md`
6. `.aether/knowledge/references/product-design/linear.md`

### Codex (Code Generation, Targeted Edits)
1. `AGENTS.md`
2. `.aether/knowledge/AI_USAGE.md`
3. `.aether/knowledge/references/ui-libraries/INDEX.md`
4. `.aether/knowledge/references/engineering/INDEX.md`
5. `SOURCE_CLASSIFICATION.md`
