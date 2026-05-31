# Aether Knowledge System — Master Index

This is the single source of truth for all design references, engineering resources,
and architectural guidance used by the Aether Browser project.

## Purpose

This knowledge system serves every AI agent and human developer working on Aether.
It provides a structured, discoverable, and maintainable index of external references
that inform the browser's design, engineering, and product decisions.

## Supported Agents

- Claude Opus 4.6 (primary architecture and engineering)
- Gemini 3.5 Flash (UI implementation and boilerplate)
- Codex (code generation and editing)
- Any future coding agent that reads markdown

## How to Use This System

- **AI agents**: Start here. Read this index to understand what references are available.
  Then navigate to the relevant category index for your current task.
- **Human developers**: Read `ONBOARDING.md` first, then browse categories as needed.
- **Contributors**: Read `CONTRIBUTING.md` before adding or modifying references.

## Quick Navigation

| Document | Purpose |
|---|---|
| [ONBOARDING.md](ONBOARDING.md) | First-time setup and orientation |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add, update, or remove references |
| [AI_USAGE.md](AI_USAGE.md) | How AI agents should consume this knowledge base |
| [MAINTENANCE.md](MAINTENANCE.md) | Long-term maintenance strategy and health checks |

## Reference Categories

| Category | Index | Count | Description |
|---|---|---|---|
| Design | [references/design/INDEX.md](references/design/INDEX.md) | 4 | Visual design guidelines and resources |
| UI Libraries | [references/ui-libraries/INDEX.md](references/ui-libraries/INDEX.md) | 4 | Component libraries and UI frameworks |
| Animation | [references/animation/INDEX.md](references/animation/INDEX.md) | 1 | Motion and animation systems |
| Browser | [references/browser/INDEX.md](references/browser/INDEX.md) | 2 | Chromium and Brave source references |
| Product Design | [references/product-design/INDEX.md](references/product-design/INDEX.md) | 2 | Product UX and interaction patterns |
| Engineering | [references/engineering/INDEX.md](references/engineering/INDEX.md) | 4 | Curated engineering resource collections |

## Total References: 17

## Reference File Format

Every reference file in this system follows a consistent structure:

```
# Reference Name
- URL: (canonical URL)
- Category: (one of the categories above)
- Relevance: (how this reference applies to Aether)
- Priority: primary | secondary | supplementary

## Description
## Key Sections
## Usage Guidelines for Aether
```

This format is designed to be parseable by both humans and AI agents without
any specialized tooling.

## Principles

1. Every reference must have a clear reason to exist in this system.
2. References must be categorized. Uncategorized references are not allowed.
3. Each reference file must explain its relevance to Aether specifically.
4. The system must remain navigable without search tooling — index files are mandatory.
5. No duplicate references across categories.
6. No dead links. All URLs must be validated periodically.
