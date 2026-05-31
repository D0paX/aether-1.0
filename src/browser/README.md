# src/browser — Aether C++ Browser Layer

## Purpose

This directory contains Aether's C++ modifications to the Brave/Chromium browser layer.

Unlike the WebUI layer (src/webui/), which handles the visual browser chrome in React/TypeScript, this directory contains modifications to Chromium's C++ browser process: tab management extensions, workspace system implementation, navigation customizations, and any other modifications that must operate at the native browser layer.

## When to Add Code Here

Add code to `src/browser/` when:
- The feature requires access to Chromium's internal C++ browser APIs
- The feature cannot be implemented in the WebUI layer
- The feature requires communication via Mojo IPC between the browser process and renderer
- The feature involves process lifecycle management (tabs, windows, sessions)

Do not add code here for:
- Features that can be implemented purely in the WebUI (React/TypeScript)
- Standalone backend services (those belong in src/services/)

## Relationship to Brave Source

Code in `src/browser/` is compiled alongside the Brave/Chromium source. Files here are either:
1. New files added to the build via a GN BUILD.gn file
2. References to modifications applied via patches in `tools/patches/`

## Status

Populated starting in Batch 09 (Core Browser Features) and Batch 15 (Workspace System).
