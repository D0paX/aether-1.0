# Apple Human Interface Guidelines

- URL: https://developer.apple.com/design/human-interface-guidelines
- Category: design
- Relevance: Primary design system informing Aether's entire UI philosophy, interaction patterns, and visual language.
- Priority: primary

## Description

Apple's Human Interface Guidelines (HIG) define the design principles, patterns, and
specifications used across all Apple platforms including macOS, iOS, iPadOS, visionOS,
watchOS, and tvOS. The HIG covers layout, typography, color, iconography, navigation,
interaction patterns, accessibility, and platform conventions.

## Key Sections

- Foundations: Color, typography, layout, materials, motion
- Components: Buttons, menus, navigation bars, sidebars, tab bars, toolbars
- Patterns: Launching, onboarding, searching, managing notifications
- Inputs: Keyboards, pointers, gestures, accessibility inputs
- Technologies: App intents, widgets, live activities
- Platform considerations: macOS-specific guidance (most relevant to Aether as a desktop browser)

## Usage Guidelines for Aether

Aether's design philosophy is explicitly Apple-inspired. The HIG is the single most
important design reference for this project.

**Adopt directly:**
- Spacing and layout grid systems
- Corner radius conventions (continuous curves, not circular arcs)
- Typography scale and weight usage
- Color palette structure (semantic colors, vibrancy, materials)
- Toolbar and sidebar layout patterns
- Focus states and keyboard navigation patterns

**Adapt for browser context:**
- Navigation patterns (browsers have unique navigation via address bar, tabs, back/forward)
- Window chrome (Aether's title bar, tab bar, and toolbar replace standard app chrome)
- Content area (web content is the primary viewport, not app-specific content)

**Do not adopt:**
- Tab bar navigation (iOS bottom tabs are not appropriate for desktop browsers)
- Sheet presentation styles (use browser-appropriate modals and panels)
- Platform-specific features that do not translate to Windows (e.g., Dynamic Island)
