# Aether

A production-grade web browser built on a Brave/Chromium foundation.

## Status

Early development. Not ready for public use.

## Architecture

- Foundation: Brave Browser fork (Chromium-based)
- Browser Engine: Blink (via Chromium)
- JavaScript Engine: V8 (via Chromium)
- UI Framework: React 19 + TypeScript (via Chromium WebUI)
- Backend Services: Rust
- Primary Platform: Windows
- Secondary Platform: Android

## Requirements

See `docs/development/SETUP_WINDOWS.md` for the full Windows build environment setup.

Minimum hardware:
- CPU: 8-core or higher (16-core recommended for faster builds)
- RAM: 32 GB (16 GB minimum, builds will be slow)
- Disk: 300 GB free space (Chromium build artifacts are large)
- OS: Windows 10 22H2 or Windows 11

## Getting Started

1. Read `AGENTS.md` completely before doing anything.
2. Follow `docs/development/SETUP_WINDOWS.md` to set up your build environment.
3. Follow `docs/development/BRAVE_FORK_GUIDE.md` to initialize the Brave fork.
4. Read `docs/architecture/OVERVIEW.md` for the system architecture.

## Repository Structure

- `.aether/` — Implementation prompt batches, architectural decisions, and custom tools.
- `android/` — Android application wrapper and platform-specific resources.
- `docs/` — Project documentation (architecture overview, developer setups, contributing guidelines).
- `extensions/` — Extension API interfaces, example extensions, and developer SDK.
- `src/` — Core browser logic, Rust backend services, and WebUI React frontend.
- `tests/` — Testing suites spanning unit, integration, e2e, and performance tests.
- `tools/` — Custom helper scripts, patches, and Chromium GN build configuration.

## Contributing

Read `docs/contributing/CONTRIBUTING.md` before submitting any changes.

## License

[To be determined]

---

Do not add anything beyond these sections. Keep the language engineering-focused and direct.