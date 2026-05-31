# KNOWLEDGE_INDEX.md — Aether Browser
# Master index of all knowledge sources, reference materials, and research repositories.

## Knowledge Architecture

Aether's knowledge system has three tiers:

```
Tier 1: Curated References       .aether/knowledge/references/
        (Structured, indexed, annotated with Aether-specific guidance)

Tier 2: Research Sources          .aether/research/
        (Raw cloned repositories, read-only, never modified)

Tier 3: External URLs             (Documented in Tier 1 reference files)
        (Not stored locally, accessed via browser when needed)
```

Tier 1 references are the primary knowledge source. They contain Aether-specific
annotations explaining what to adopt, what to adapt, and what to avoid. Always
consult Tier 1 before falling back to Tier 2 or Tier 3.

## Tier 1: Curated Reference Index

Full documentation: [.aether/knowledge/INDEX.md](.aether/knowledge/INDEX.md)

### Design References (4)

| Reference | Priority | File |
|---|---|---|
| Apple Human Interface Guidelines | primary | `.aether/knowledge/references/design/apple-hig.md` |
| Apple Design Resources | primary | `.aether/knowledge/references/design/apple-design-resources.md` |
| Material Design 3 | secondary | `.aether/knowledge/references/design/material-design-3.md` |
| Material Design Foundations | secondary | `.aether/knowledge/references/design/material-design-foundations.md` |

### UI Libraries (4)

| Reference | Priority | File |
|---|---|---|
| shadcn/ui | secondary | `.aether/knowledge/references/ui-libraries/shadcn-ui.md` |
| Radix UI | secondary | `.aether/knowledge/references/ui-libraries/radix-ui.md` |
| Magic UI | supplementary | `.aether/knowledge/references/ui-libraries/magic-ui.md` |
| Aceternity UI | supplementary | `.aether/knowledge/references/ui-libraries/aceternity-ui.md` |

### Animation (1)

| Reference | Priority | File |
|---|---|---|
| Framer Motion | primary | `.aether/knowledge/references/animation/framer-motion.md` |

### Browser (2)

| Reference | Priority | File |
|---|---|---|
| Chromium Source | primary | `.aether/knowledge/references/browser/chromium-source.md` |
| Brave Browser | primary | `.aether/knowledge/references/browser/brave-browser.md` |

### Product Design (2)

| Reference | Priority | File |
|---|---|---|
| Linear | primary | `.aether/knowledge/references/product-design/linear.md` |
| Stripe | secondary | `.aether/knowledge/references/product-design/stripe.md` |

### Engineering (4)

| Reference | Priority | File |
|---|---|---|
| Awesome Design Systems | supplementary | `.aether/knowledge/references/engineering/awesome-design-systems.md` |
| Awesome React | supplementary | `.aether/knowledge/references/engineering/awesome-react.md` |
| Awesome React Components | supplementary | `.aether/knowledge/references/engineering/awesome-react-components.md` |
| Awesome UX Design | supplementary | `.aether/knowledge/references/engineering/awesome-ux-design.md` |

## Tier 2: Research Sources (Cloned Repositories)

Location: `.aether/research/`

These are raw cloned repositories. They are gitignored and never committed to
Aether's history. See `SOURCE_CLASSIFICATION.md` for detailed classification
of each repository.

| Repository | Classification | Local Path |
|---|---|---|
| brave-browser | Primary Reference | `.aether/research/brave-browser/` |
| awesome-design-systems | Secondary Reference | `.aether/research/awesome-design-systems/` |
| awesome-react | Secondary Reference | `.aether/research/awesome-react/` |
| awesome-react-components | Secondary Reference | `.aether/research/awesome-react-components/` |

### Research Source Rules

1. Never modify files in `.aether/research/`.
2. Never copy code from research sources into production.
3. Never import or reference research paths in build configuration.
4. Use research sources for reading, learning, and pattern study only.
5. When a research source informs a decision, cite the Tier 1 reference file instead.

## Tier 3: External URLs

External URLs are documented inside Tier 1 reference files. Each reference file
contains the canonical URL for the external resource. These URLs are not cached
locally and must be accessed via browser when deeper reading is needed.

See the individual reference files in `.aether/knowledge/references/` for all URLs.

## Knowledge Maintenance

See [.aether/knowledge/MAINTENANCE.md](.aether/knowledge/MAINTENANCE.md) for the
maintenance schedule, link validation process, and deprecation policy.

## Adding Knowledge

See [.aether/knowledge/CONTRIBUTING.md](.aether/knowledge/CONTRIBUTING.md) for
the process of adding new references, research sources, or categories.
