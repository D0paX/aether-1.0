# Chromium Source

- URL: https://chromium.googlesource.com/chromium/src.git
- Category: browser
- Relevance: Upstream browser engine that Aether is built on. All browser-level features ultimately interact with this codebase.
- Priority: primary

## Description

The Chromium project is the open-source browser engine that powers Google Chrome,
Microsoft Edge, Brave, Opera, Vivaldi, and now Aether. The source repository contains
the Blink rendering engine, V8 JavaScript engine, the browser process architecture,
networking stack, GPU compositing, WebUI framework, extension system, and all
platform-specific integration code.

## Key Sections

- `chrome/browser/`: Browser process code, profiles, sessions, browser window management
- `chrome/browser/ui/webui/`: WebUI framework (how React-based UI pages are served)
- `chrome/browser/ui/views/`: Native views and window frame code (Windows/Linux)
- `content/`: Content module (renderer process, navigation, site isolation)
- `components/`: Shared components used across the browser
- `ui/webui/resources/`: WebUI resource bundling and serving infrastructure
- `build/`: GN build system configuration
- `tools/gn/`: GN build tool source
- `third_party/blink/`: Blink rendering engine
- `v8/`: V8 JavaScript engine

## Usage Guidelines for Aether

Chromium source is the **most technically critical reference** in this system.

**Essential knowledge areas:**
- WebUI framework: How to register new WebUI pages, serve React bundles, and
  communicate between the browser process (C++) and web content (TypeScript)
- Browser window management: How `BrowserWindow`, `BrowserView`, and `TabStripModel`
  work in the browser process
- Navigation: How `NavigationController`, `NavigationHandle`, and `WebContents`
  manage page navigation
- Build system: How GN files declare targets, dependencies, and source sets
- IPC: Mojo interfaces for inter-process communication between browser, renderer,
  and utility processes

**Approach for modifications:**
- Never modify upstream Chromium files directly. Apply changes through Brave's
  patching system or Aether-specific override points.
- Study the upstream implementation thoroughly before creating patches.
- Prefer Brave's existing override mechanisms (feature flags, build flags, component
  replacement) over direct source modification.
- All C++ changes must follow Chromium's style guide: 2-space indentation, Google
  C++ style, `//`-style comments, Chromium naming conventions.

**Do not do:**
- Do not fork Chromium directly — Aether forks Brave which manages the Chromium relationship
- Do not modify V8 or Blink internals unless absolutely necessary
- Do not bypass Chromium's security architecture (sandbox, site isolation, process model)
