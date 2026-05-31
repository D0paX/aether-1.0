# Aether Knowledge System — Onboarding

Welcome to the Aether knowledge system. This document explains what this system is,
why it exists, and how to navigate it effectively.

## What Is This?

The `.aether/knowledge/` directory is a centralized reference library for the Aether
Browser project. It contains structured documentation about every external resource,
design system, and engineering reference that informs how Aether is built.

## Why Does This Exist?

Aether is developed by multiple AI agents (Claude, Gemini, Codex) and human developers
working across different sessions, contexts, and time periods. Without a shared knowledge
base, each agent reinvents its understanding of the project's design and engineering
principles from scratch. This system solves that problem by providing:

1. A single source of truth for all references.
2. Consistent categorization so any agent can find what it needs.
3. Relevance annotations that explain how each reference applies to Aether.
4. Priority levels that help agents decide which references matter most.

## How to Navigate

### Step 1: Start at the Master Index

Open [INDEX.md](INDEX.md). This file lists every reference category with a link to
its category-level index.

### Step 2: Browse by Category

Each category has its own `INDEX.md` inside `references/<category>/`. The category
index lists every reference in that category with a one-line summary.

### Step 3: Read Individual References

Each reference has its own markdown file with a consistent format:
- What it is
- Where to find it
- Why it matters to Aether
- Which sections are most relevant
- How to apply it in practice

## Priority Levels

References are tagged with one of three priority levels:

| Priority | Meaning |
|---|---|
| `primary` | Core to Aether's identity. Must be consulted for relevant decisions. |
| `secondary` | Valuable for implementation. Should be consulted when applicable. |
| `supplementary` | Useful for exploration and inspiration. Consult when time allows. |

## For AI Agents

If you are an AI agent reading this:

1. Read [AI_USAGE.md](AI_USAGE.md) for agent-specific guidance.
2. Always check the relevant category index before starting work.
3. Cite references by their file path when making design or engineering decisions.
4. Do not modify reference files unless explicitly asked to do so.

## For Human Developers

If you are a human developer:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) to understand how to add references.
2. Browse categories that are relevant to your current work.
3. If you find a reference that should be added, follow the contribution process.
4. If you find a dead link, update it or flag it for removal.

## Directory Structure

```
.aether/knowledge/
  INDEX.md              Master index (start here)
  ONBOARDING.md         This file
  CONTRIBUTING.md       How to add or modify references
  AI_USAGE.md           Agent-specific usage guidance
  MAINTENANCE.md        Long-term maintenance strategy
  references/
    design/             Visual design guidelines
    ui-libraries/       Component libraries
    animation/          Motion and animation systems
    browser/            Chromium and Brave sources
    product-design/     Product UX patterns
    engineering/        Curated resource collections
```
