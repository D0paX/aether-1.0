# Material Design 3

- URL: https://m3.material.io
- Category: design
- Relevance: Reference for color system architecture, dynamic color theory, accessibility specifications, and component anatomy documentation.
- Priority: secondary

## Description

Material Design 3 (M3) is Google's latest design system, featuring dynamic color,
updated component designs, and refined typography. It provides comprehensive
documentation on color theory, theming, accessibility, and responsive layout that
is well-structured and technically detailed.

## Key Sections

- Color system: Dynamic color, color roles, tonal palettes, custom colors
- Typography: Type scale, font weight usage, line height specifications
- Shape: Corner radius system, shape scale
- Motion: Easing curves, duration tokens, transition patterns
- Components: Component anatomy, states, and accessibility requirements
- Accessibility: Contrast ratios, touch targets, screen reader guidance

## Usage Guidelines for Aether

Material Design 3 is a **secondary reference**. Aether does not adopt Material Design
aesthetics. However, M3's documentation on color systems and accessibility is among
the most thorough in the industry.

**Use as reference for:**
- Color system architecture: M3's tonal palette system and color role definitions
  are well-documented and can inform how Aether structures its own color tokens
- Accessibility specifications: Contrast ratio requirements, minimum touch/click
  target sizes, focus indicator specifications
- Component state documentation: M3's documentation of enabled, disabled, hovered,
  focused, pressed, and dragged states is comprehensive

**Do not adopt:**
- Material Design visual style (rounded rectangles with specific M3 corner radii)
- Material Design elevation system (Aether uses a different depth model)
- Material Design component designs (Aether's components follow Apple conventions)
- Material Design motion curves (Aether uses spring-based animations via Framer Motion)
- Ripple effects or any Material-specific interaction patterns
