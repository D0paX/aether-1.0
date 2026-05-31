# Brave Fork Initialization Guide

## Overview

Aether is built on a fork of the Brave Browser. Brave itself is a fork of Chromium. This means the build system fetches the full Chromium source tree (~45 GB) plus Brave's patches on top.

This guide covers:
1. Cloning the Brave browser repository
2. Fetching all dependencies via gclient
3. Verifying the first successful build
4. Understanding the patch system

## Prerequisites

All steps in `docs/development/SETUP_WINDOWS.md` must be completed. Run `tools/scripts/verify-env.ps1` and confirm all checks pass before continuing.

## Disk Space Warning

The complete checkout with build artifacts will use approximately 250–300 GB. Ensure this space is available before starting. The checkout process cannot be safely interrupted once gclient sync begins.

## Step 1 — Choose Your Checkout Location

The Brave source must be checked out separately from the `aether/` repository. The Chromium build system does not support being nested inside another git repository.

Recommended location: `C:\src\brave-browser\`

```cmd
mkdir C:\src
cd C:\src
```

## Step 2 — Clone the Brave Browser Repository

```cmd
git clone https://github.com/brave/brave-browser.git
cd brave-browser
```

## Step 3 — Initialize and Sync Dependencies

This step downloads Chromium and all its dependencies. It will take 1 to 3 hours depending on your internet connection.

```cmd
npm install
npm run init
```

`npm run init` runs `gclient sync` internally. It will download:
- The full Chromium source tree (~40 GB)
- Brave's patch set applied on top of Chromium
- All third-party dependencies (V8, Blink, Skia, ICU, etc.)

Do not interrupt this process. If it fails partway through, run `npm run sync` to resume.

## Step 4 — Verify the Source Tree

After sync completes, verify the structure:

```cmd
dir C:\src\brave-browser\src
```

You should see directories including: `base`, `chrome`, `components`, `content`, `net`, `v8`, `third_party`.

## Step 5 — Configure GN Build Arguments

Create the build configuration for Aether:

```cmd
cd C:\src\brave-browser
npm run build -- --target=Release
```

For faster development iteration, use a debug build:

```cmd
npm run build -- --target=Debug
```

GN args for Aether customization are stored in `aether/tools/gn/aether_args.gn`. These will be applied in Batch 04 (Aether Identity).

## Step 6 — First Build

The first build will take 2 to 4 hours on an 8-core machine. Subsequent incremental builds take 5 to 20 minutes.

```cmd
npm run build
```

After the build completes, the browser executable is at:
- Release: `C:\src\brave-browser\src\out\Release\brave.exe`
- Debug: `C:\src\brave-browser\src\out\Debug\brave.exe`

## Step 7 — Verify the Build

Launch the browser:
```cmd
C:\src\brave-browser\src\out\Release\brave.exe
```

Verify:
- Browser opens without crashing
- Address bar is functional
- A test URL (https://example.com) loads correctly

## Understanding the Repository Layout

C:\src\brave-browser\       <- Brave's repository (managed by gclient)
├── src/                    <- Full Chromium source with Brave patches
│   ├── brave/              <- Brave-specific source code
│   ├── chrome/             <- Chrome/Chromium source (modified by Brave)
│   └── ...                 <- All other Chromium directories
└── ...
aether/                     <- Aether's repository (this repo)
├── tools/patches/          <- Aether patches applied on top of Brave
├── src/browser/            <- Aether C++ modifications
└── ...


## Patch Workflow

Aether's modifications to Brave/Chromium are managed as a patch series in `aether/tools/patches/`. The order of patches is defined in `aether/tools/patches/series`.

To apply Aether patches to a fresh Brave checkout:
```powershell
powershell -ExecutionPolicy Bypass -File aether/tools/scripts/apply-patches.ps1
```

(This script is created in a later batch.)

## Staying Current with Brave Upstream

Brave releases follow Chromium's release cadence (approximately every 4 weeks). To pull the latest Brave release:

```cmd
cd C:\src\brave-browser
git fetch origin
git checkout [latest-stable-tag]
npm run sync
```

Then reapply Aether patches and verify no conflicts.

## Next Step

After the first successful build is verified, proceed to `aether/.aether/prompts/batch-04-aether-identity/` to rename the browser and establish Aether's identity.
