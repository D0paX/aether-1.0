# SOURCE_CLASSIFICATION.md — Aether Browser
# Classification of every external source in the repository.

## Classification System

Every cloned repository and external reference is assigned one of these classifications:

| Classification | Meaning | Code Copying | Architecture Influence |
|---|---|---|---|
| Primary Reference | Essential to Aether's development. Must be consulted for relevant work. | Never | Yes, directly |
| Secondary Reference | Valuable for implementation. Consult when applicable. | Never | Yes, indirectly |
| Optional Reference | Useful for exploration. Consult when time allows. | Never | Minimal |
| Research Only | Study material. No direct influence on Aether. | Never | No |
| Do Not Use | Explicitly excluded. Conflicts with Aether's direction. | Never | No |

**Universal rule: Code from external repositories must never be copied into Aether's
production source code.** Patterns, approaches, and concepts may be studied and
reimplemented independently, but direct code copying creates license, maintenance,
and quality risks.

---

## Cloned Repository Classifications

### brave-browser

- **Classification: Primary Reference**
- Local Path: `.aether/research/brave-browser/`
- Source: https://github.com/brave/brave-browser
- License: MPL-2.0
- Tier 1 Reference: `.aether/knowledge/references/browser/brave-browser.md`

**Why it exists:**
Brave Browser is Aether's direct fork parent. This repository contains the build
system metadata, changelogs, issue tracking conventions, and release structure that
Aether inherits. The actual source code lives in `brave-core` (not cloned here),
but this repository documents versions, release notes, and the project structure.

**When to consult:**
- Before any Chromium version upgrade
- When studying Brave's release process and versioning
- When understanding Brave's project structure and governance
- When reviewing changelogs for features Aether inherits or removes

**Knowledge to extract:**
- Version numbering and release cadence
- Changelog structure and format
- Build system configuration (`package.json` scripts)
- Issue categorization and labeling patterns

**Should code be copied:** No. Aether forks Brave at the build system level, not
by copying files from this repository.

**Architecture influence:** Yes, directly. Brave's architecture decisions constrain
and inform Aether's browser-level architecture. Understanding Brave's structure
is prerequisite to modifying Aether's browser layer.

---

### awesome-design-systems

- **Classification: Secondary Reference**
- Local Path: `.aether/research/awesome-design-systems/`
- Source: https://github.com/alexpate/awesome-design-systems
- License: MIT
- Tier 1 Reference: `.aether/knowledge/references/engineering/awesome-design-systems.md`

**Why it exists:**
A curated directory of production design systems from companies like Atlassian,
IBM, Shopify, GitHub, and Adobe. Useful for studying how established organizations
structure design tokens, component documentation, and design system governance.

**When to consult:**
- When designing Aether's design token architecture
- When studying component naming conventions across the industry
- When evaluating how other design systems handle theming, dark mode, or density
- When looking for specific design system implementations to study

**Knowledge to extract:**
- Token organization patterns (how companies structure color, spacing, typography tokens)
- Component naming conventions and API patterns
- Documentation approaches for design systems
- Governance models for design system maintenance

**Should code be copied:** No. This is a list of links, not source code.

**Architecture influence:** Yes, indirectly. The patterns documented here inform
how Aether structures its own design tokens in `src/webui/src/styles/tokens.css`
and its component architecture.

---

### awesome-react

- **Classification: Secondary Reference**
- Local Path: `.aether/research/awesome-react/`
- Source: https://github.com/enaqx/awesome-react
- License: (No explicit license file)
- Tier 1 Reference: `.aether/knowledge/references/engineering/awesome-react.md`

**Why it exists:**
A comprehensive index of the React ecosystem including frameworks, state management
libraries, styling solutions, testing tools, and development utilities. Useful for
discovering tools and evaluating approaches.

**When to consult:**
- When looking for a specific React library to solve a problem
- When evaluating state management approaches (Aether uses Zustand, but understanding
  alternatives provides context)
- When researching React performance optimization techniques
- When evaluating testing tools and strategies for Aether's WebUI

**Knowledge to extract:**
- React ecosystem awareness (what libraries exist for specific problems)
- Performance optimization patterns
- Testing strategies and tool comparisons
- Current React best practices and conventions

**Should code be copied:** No. This is a list of links, not source code.

**Architecture influence:** Yes, indirectly. Understanding the React ecosystem
helps make informed decisions about Aether's frontend tooling, though Aether's
core decisions (React 19, Zustand, Framer Motion) are already locked.

---

### awesome-react-components

- **Classification: Secondary Reference**
- Local Path: `.aether/research/awesome-react-components/`
- Source: https://github.com/brillout/awesome-react-components
- License: Creative Commons Attribution 4.0
- Tier 1 Reference: `.aether/knowledge/references/engineering/awesome-react-components.md`

**Why it exists:**
A categorized directory of React UI components organized by type (tables, forms,
charts, modals, tooltips, drag-and-drop, etc.). Useful for studying component APIs
and interaction patterns before building Aether's own implementations.

**When to consult:**
- When building a specific component type and want to study existing API patterns
- When evaluating accessibility approaches for complex components
- When researching virtualization, drag-and-drop, or other technically complex UI patterns
- When looking for inspiration on how to handle edge cases in component behavior

**Knowledge to extract:**
- Component API design patterns (props, events, composition)
- Accessibility implementations for specific component types
- Performance approaches for complex components (virtualization, lazy loading)
- Edge case handling in production-quality components

**Should code be copied:** No. Study APIs and patterns, then implement independently.

**Architecture influence:** Yes, indirectly. Component API patterns from well-regarded
libraries inform how Aether's components expose their props and handle composition.

---

## Repositories NOT Cloned (Referenced via URLs Only)

The following external references exist only as Tier 1 documentation files with
URLs. They are not cloned into the repository.

| Reference | Classification | Reason Not Cloned |
|---|---|---|
| Apple HIG | Primary Reference | Web-only resource, no repository to clone |
| Apple Design Resources | Primary Reference | Requires Apple developer account for assets |
| Material Design 3 | Secondary Reference | Web-only resource |
| Material Design Foundations | Secondary Reference | Web-only resource |
| shadcn/ui | Secondary Reference | Library code, not a reference repository |
| Radix UI | Secondary Reference | Library code, not a reference repository |
| Magic UI | Optional Reference | Library code, not a reference repository |
| Aceternity UI | Optional Reference | Library code, not a reference repository |
| Framer Motion | Primary Reference | Direct dependency, installed via pnpm |
| Chromium Source | Primary Reference | Too large to clone for reference (30GB+) |
| Linear | Primary Reference | Proprietary product, no public repository |
| Stripe | Secondary Reference | Proprietary product, no public repository |

---

## Classification Decisions Log

| Date | Repository | Classification | Rationale |
|---|---|---|---|
| 2025-05-31 | brave-browser | Primary Reference | Direct fork parent. Understanding its structure is non-negotiable. |
| 2025-05-31 | awesome-design-systems | Secondary Reference | Informs design token architecture. Not essential for daily work. |
| 2025-05-31 | awesome-react | Secondary Reference | Ecosystem awareness resource. Consult when evaluating tools. |
| 2025-05-31 | awesome-react-components | Secondary Reference | Component API study resource. Consult when building complex components. |
| 2025-05-31 | awesome-ux-design | Not Available | Repository not found at the documented URL. Retained as Tier 1 documentation only. |
