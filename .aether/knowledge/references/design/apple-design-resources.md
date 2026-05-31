# Apple Design Resources

- URL: https://developer.apple.com/design/resources
- Category: design
- Relevance: Official Apple design assets providing concrete specifications for typography, icons, color palettes, and component dimensions.
- Priority: primary

## Description

Apple Design Resources is a collection of official design files, templates, and assets
provided by Apple for designers building apps on Apple platforms. It includes Sketch,
Figma, and XD templates with production-accurate component specifications, SF Symbols
icon library access, and platform-specific design kits.

## Key Sections

- Design templates: macOS, iOS, iPadOS, visionOS design kits
- SF Symbols: Apple's icon system (5,000+ symbols with weight and scale variants)
- Typography: San Francisco font family specifications and usage guidelines
- Color palettes: System colors, semantic colors, and accessibility-compliant palettes
- Component specifications: Exact dimensions, padding, and spacing for standard components

## Usage Guidelines for Aether

**Adopt directly:**
- SF Symbols naming conventions and conceptual organization for Aether's icon system
- San Francisco font metrics as a baseline for Aether's typography scale
- Component dimension ratios (button heights, input heights, toolbar heights)
- Color palette structure (not the exact colors, but the organizational approach of
  semantic, system, and accent color layers)

**Adapt for browser context:**
- Icon sizes should match browser UI density, which is typically denser than native apps
- Typography may need adjustment for web rendering vs native rendering
- Component sizes should account for mouse-primary interaction on Windows

**Do not adopt:**
- Apple-proprietary assets (SF Symbols themselves cannot be redistributed outside Apple platforms)
- Exact Apple color values (Aether needs its own brand identity)
- Platform-specific design kit layouts (these are for native app design, not browser UI)
