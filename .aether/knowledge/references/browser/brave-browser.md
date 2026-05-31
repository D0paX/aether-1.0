# Brave Browser

- URL: https://github.com/brave/brave-browser
- Category: browser
- Relevance: Direct fork parent for Aether. Understanding Brave's architecture, build system, and customization patterns is essential.
- Priority: primary

## Description

Brave Browser is a privacy-focused Chromium-based browser. Its repository serves as
a build system wrapper around Chromium, with a patching mechanism that modifies
Chromium source files and adds Brave-specific features. Brave manages the complexity
of tracking upstream Chromium releases while maintaining its own feature set.

## Key Sections

- `brave-browser/`: Top-level repository with build scripts and dependency management
- `brave-core/` (submodule): Brave-specific source code, patches, and components
- `chromium_src/` overrides: Brave's mechanism for overriding Chromium source files
  without modifying them directly
- Build system: `npm run init`, `npm run build`, and the brave-specific GN args
- Patching system: How Brave applies patches to Chromium source during the build
- Feature flags: Brave's feature flag system for enabling/disabling functionality
- WebUI customizations: How Brave modifies Chromium WebUI pages (new tab, settings)

## Usage Guidelines for Aether

Brave is the **direct parent fork** for Aether. Understanding its architecture is
non-negotiable for any browser-level work.

**Essential knowledge areas:**
- Build process: How to initialize, sync, and build Brave from source on Windows
- `chromium_src/` override pattern: How to override a Chromium source file by placing
  a modified copy in `chromium_src/` with the same relative path
- Brave Components: How Brave adds new browser components (shields, rewards, wallet)
  and how Aether can follow the same pattern for its own features
- Brave's GN configuration: Build flags, feature flags, and platform-specific settings
- Update mechanism: How Brave handles Chromium version updates and how Aether will
  need to track these

**Approach for Aether modifications:**
- Use Brave's existing override mechanisms where possible
- Add Aether-specific components following Brave's component architecture
- Maintain compatibility with Brave's upstream merge process to simplify future
  Chromium version updates
- Document all deviations from Brave's default behavior

**Do not do:**
- Do not remove Brave features that Aether depends on (networking, security, update system)
- Do not modify Brave's core patching system
- Do not assume Brave's feature set is stable — features may change with Chromium updates
