# Radix UI

- URL: https://www.radix-ui.com
- Category: ui-libraries
- Relevance: Reference for accessible, unstyled primitive components and WAI-ARIA pattern implementation.
- Priority: secondary

## Description

Radix UI is a library of low-level, unstyled, accessible UI primitives for React.
It provides components like dialogs, dropdowns, tooltips, popovers, accordions, and
more, with complete keyboard navigation, focus management, and screen reader support
built in. Radix components are intentionally unstyled, providing behavior and
accessibility without imposing visual design.

## Key Sections

- Primitives: Dialog, dropdown menu, context menu, popover, tooltip, accordion,
  tabs, toggle, slider, select, navigation menu, hover card, collapsible
- Accessibility: WAI-ARIA pattern implementations for each component
- Composition: Compound component pattern, asChild prop pattern
- Animation: Integration points for CSS and JS animation libraries

## Usage Guidelines for Aether

Aether does not use Radix UI as a dependency. Aether builds its own components.
However, Radix's accessibility implementations are a gold standard reference.

**Use as reference for:**
- Accessibility patterns: How to implement WAI-ARIA roles, states, and properties
  for each component type
- Keyboard navigation: Tab order, arrow key navigation, escape key behavior,
  focus trapping in modals and dropdowns
- Focus management: How focus moves when opening/closing overlays, how to restore
  focus to trigger elements
- Component anatomy: The relationship between trigger, content, overlay, and portal
  in overlay-type components
- Compound component pattern: How to structure multi-part components with shared state

**Do not adopt:**
- Radix's specific API surface (prop names, event handlers)
- The asChild pattern (Aether uses standard React composition)
- Radix's portal implementation (Aether may need browser-specific portal behavior)
- Any Radix themes or styling (Aether has its own design system)
