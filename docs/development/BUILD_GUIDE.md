# Build Guide

## Overview

Aether uses the Chromium build system: GN for build configuration and Ninja for compilation. Brave's npm scripts wrap these tools with sensible defaults.

The Aether repository (`aether/`) and the Brave fork (`C:\src\brave-browser\`) are separate directories. Aether patches are applied on top of the Brave fork. All build commands are run from inside `C:\src\brave-browser\`.

## Build Types

### Development Build (recommended during active development)
- Component build enabled: each component is a separate DLL, enabling fast incremental builds
- Debug symbols: partial (symbol_level = 1)
- Optimizations: reduced
- Typical first build time: 2–4 hours
- Typical incremental build time: 5–20 minutes

### Release Build (for testing production performance)
- Component build disabled: single executable, smaller binary
- Debug symbols: none (symbol_level = 0)
- Full optimization: enabled
- Typical first build time: 3–5 hours
- Use this build to test real-world performance

## Running a Development Build

From `C:\src\brave-browser\`:
```cmd
npm run build -- --target=Debug
```

Or using Aether's build script from `aether/`:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\build.ps1 -Target Debug
```

## Running a Release Build

From `aether/`:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\build.ps1 -Target Release
```

## Build Output Locations

- Debug build: `C:\src\brave-browser\src\out\Debug\`
- Release build: `C:\src\brave-browser\src\out\Release\`
- Browser executable: `out\Debug\chrome.exe` (renamed to `aether.exe` in Batch 04)

## Cleaning Build Artifacts

To clean a specific build type:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\clean.ps1 -Target Debug
```

To clean all build artifacts (frees 80–120 GB of disk space):
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\clean.ps1 -All
```

> [!WARNING]
> A full clean requires a complete rebuild which takes 2–4 hours.

## GN Build Arguments

Aether's GN arguments are defined in `aether/tools/gn/aether_args.gn`.

To apply updated GN args without a full rebuild:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\build.ps1 -ReconfigureOnly
```

GN will regenerate build files. Only files affected by the changed args will be recompiled.

## Updating from Brave Upstream

When Brave releases a new version:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\update-brave.ps1
```

This script: fetches the new Brave tag, runs gclient sync, reapplies Aether patches, and verifies the result builds cleanly.

## Parallel Build Jobs

By default, Ninja uses all available CPU cores. To limit parallelism (reduces memory usage):
Edit `aether/tools/gn/aether_args.gn` and add:
```gn
concurrent_links = 1
```

To limit ninja jobs when running manually:
```cmd
ninja -j 8 -C src/out/Debug chrome
```

## Applying Aether Patches

After a clean Brave checkout or after an upstream update:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\apply-patches.ps1
```

Patches are stored in `aether/tools/patches/` and applied in the order defined in `aether/tools/patches/series`.

## Checking Build Health

After any build, run:
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\verify-build.ps1
```

This script verifies the executable exists, launches it, and confirms it does not crash immediately.
