# Material Design Foundations

- URL: https://m2.material.io/design
- Category: design
- Relevance: Reference for foundational layout principles, responsive grid systems, and motion design theory.
- Priority: secondary

## Description

Material Design Foundations (M2) is the original Material Design specification by
Google. While superseded by M3 for component design, the M2 foundations documentation
remains one of the most comprehensive resources for layout systems, responsive design
breakpoints, density guidelines, and motion design principles.

## Key Sections

- Layout: Responsive layout grid, breakpoints, spacing methods, component behavior
- Typography: Type system fundamentals, scale generation, readability guidelines
- Motion: Duration and easing, choreography, understanding motion
- Color: Color usage, the color system, applying color to UI
- Interaction: States, gestures, selection
- Communication: Data formats, writing, imagery

## Usage Guidelines for Aether

Material Design Foundations is a **secondary reference** for its theoretical content,
not its visual implementation.

**Use as reference for:**
- Layout grid theory: How to structure responsive grids, margin/gutter calculations,
  and breakpoint definitions
- Motion design theory: Choreography principles, the concept of container transforms,
  shared axis transitions, and how motion communicates hierarchy
- Density guidelines: How to adjust component sizes for high-density UI (relevant
  for Aether's browser chrome which is denser than typical apps)
- Elevation theory: The concept of elevation as a communication tool (though Aether
  implements elevation differently)

**Do not adopt:**
- Material Design 2 visual style
- Material Design 2 component specifications (superseded by M3)
- 8dp grid system as a hard rule (Aether may use a different base unit)
- Material Design 2 color palette
- Any M2-specific interaction patterns (FAB, bottom sheets, snackbars)
