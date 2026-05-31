# shadcn/ui

- URL: https://ui.shadcn.com
- Category: ui-libraries
- Relevance: Reference for component API design, copy-paste component architecture, and the pattern of owning component source code rather than importing from a package.
- Priority: secondary

## Description

shadcn/ui is a collection of reusable UI components built with Radix UI primitives
and styled with Tailwind CSS. Unlike traditional component libraries, shadcn/ui
components are copied into the project source rather than installed as a dependency.
This gives developers full ownership and customization ability over every component.

## Key Sections

- Components: Comprehensive list of UI components (buttons, dialogs, dropdowns, etc.)
- Theming: CSS variable-based theming system
- Dark mode: Implementation approach for light/dark mode switching
- CLI: Component installation and scaffolding tooling
- Blocks: Pre-built page sections and layouts

## Usage Guidelines for Aether

Aether does not use shadcn/ui directly. Aether does not use Tailwind CSS. However,
shadcn/ui's architectural patterns are valuable references.

**Use as reference for:**
- Component API design: How shadcn/ui structures component props, variants, and sizes
- CSS variable theming: The pattern of defining all design tokens as CSS custom
  properties and referencing them in component styles
- Component composition: How components are built from smaller primitives
- Variant pattern: The concept of defining component variants (default, destructive,
  outline, ghost, link) as a structured system

**Do not adopt:**
- Tailwind CSS utility classes (Aether uses vanilla CSS with custom properties)
- shadcn/ui's specific component implementations
- The CLI installation workflow (Aether builds components from scratch)
- className-based variant application (Aether uses CSS custom properties and data attributes)
