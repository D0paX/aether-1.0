# Aether Knowledge System — AI Agent Usage Guide

This document defines how AI coding agents should discover, read, and apply
references from the Aether knowledge system.

## Target Agents

This guide applies to:
- Claude Opus 4.6 (primary architecture and engineering agent)
- Gemini 3.5 Flash (UI implementation and boilerplate agent)
- Codex (code generation and editing agent)
- Any future AI coding agent integrated into the Aether workflow

## Discovery Protocol

When an AI agent begins a task related to Aether, it should:

1. **Check AGENTS.md** at the repository root for project rules and constraints.
2. **Check this knowledge system** at `.aether/knowledge/INDEX.md` for relevant references.
3. **Navigate to the appropriate category** based on the task type.
4. **Read relevant reference files** before generating code or making decisions.

### Task-to-Category Mapping

| Task Type | Primary Category | Secondary Categories |
|---|---|---|
| UI component design | Design | UI Libraries, Animation |
| Layout and spacing | Design | Product Design |
| Component implementation | UI Libraries | Animation, Engineering |
| Animation and transitions | Animation | Design |
| Chromium integration | Browser | Engineering |
| Build system changes | Browser | Engineering |
| Architecture decisions | Engineering | Browser |
| UX patterns and flows | Product Design | Design |

## How to Cite References

When making a decision informed by a reference in this system, cite the reference
by its path relative to the repository root:

```
Decision informed by .aether/knowledge/references/design/apple-hig.md
```

This makes decisions traceable and auditable.

## Priority Interpretation

| Priority | Agent Behavior |
|---|---|
| `primary` | Must consult before making relevant decisions. Deviation from primary references requires explicit justification. |
| `secondary` | Should consult when the reference category is relevant to the current task. |
| `supplementary` | May consult for additional context or alternative approaches. |

## Agent-Specific Guidance

### Claude Opus 4.6

You handle architecture, Chromium C++ integration, Rust services, and complex
engineering decisions. Your primary reference categories are:

- **Browser**: Always consult before modifying Chromium or Brave source.
- **Engineering**: Consult for architectural patterns and best practices.
- **Design**: Consult when architectural decisions have UI implications.

### Gemini 3.5 Flash

You handle UI component implementation, boilerplate generation, and documentation.
Your primary reference categories are:

- **Design**: Always consult for visual design decisions.
- **UI Libraries**: Consult for component API patterns and accessibility.
- **Animation**: Consult when implementing transitions or motion.
- **Product Design**: Consult for UX interaction patterns.

### Codex

You handle code generation and targeted edits. Your primary reference categories are:

- **UI Libraries**: Consult for component structure and API patterns.
- **Engineering**: Consult for code organization and best practices.
- **Browser**: Consult when editing browser-level code.

## Rules

1. Never modify reference files unless explicitly instructed to do so.
2. Never add references without following the process in `CONTRIBUTING.md`.
3. Always prefer primary references over secondary or supplementary ones when
   guidance conflicts.
4. If a reference contradicts `AGENTS.md`, the `AGENTS.md` rule takes precedence.
5. If a reference contradicts the Aether design philosophy (Apple-inspired, no
   Material Design adoption), the design philosophy takes precedence.

## Conflict Resolution

The hierarchy of authority for design and engineering decisions:

1. `AGENTS.md` (highest priority — non-negotiable rules)
2. Explicit instructions in the current prompt
3. Primary references in this knowledge system
4. Secondary references in this knowledge system
5. Supplementary references in this knowledge system
6. General best practices and agent judgment (lowest priority)
