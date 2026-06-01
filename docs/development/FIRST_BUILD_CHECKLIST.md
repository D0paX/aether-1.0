# First Build Checklist — Batch 03

Complete every step in order. Do not skip.

## Prerequisites

Before starting this checklist:
- [ ] Batch 01 complete (repository structure initialized)
- [ ] Batch 02 complete (development tooling installed)
- [ ] `tools/scripts/verify-env.ps1` reports all checks PASS
- [ ] 300 GB free disk space confirmed
- [ ] Stable internet connection (downloads ~45 GB)

## Step 1 — Clone Brave Browser Repository

Open a terminal with Administrator privileges.

```powershell
mkdir C:\src
cd C:\src
git clone https://github.com/brave/brave-browser.git
cd brave-browser
```

**Verify:** `dir C:\src\brave-browser` shows the repository contents including `package.json`.

## Step 2 — Install Brave's Node Dependencies

```powershell
cd C:\src\brave-browser
npm install
```

**Verify:** Completes without errors. `node_modules/` directory exists.

## Step 3 — Sync Chromium Source (Takes 1-3 Hours)

This step downloads the full Chromium source (~45 GB). Do not interrupt it.

```powershell
npm run init
```

If the sync is interrupted, resume with:

```powershell
npm run sync
```

**Verify after completion:** `dir C:\src\brave-browser\src` shows directories: `base`, `chrome`, `components`, `content`, `net`, `v8`, `third_party`.

## Step 4 — Set BRAVE_SRC Environment Variable

Set this permanently in System Environment Variables:

```
Variable name:  BRAVE_SRC
Variable value: C:\src\brave-browser
```

Or set it for the current terminal session:

```powershell
$env:BRAVE_SRC = "C:\src\brave-browser"
```

**Verify:** `echo $env:BRAVE_SRC` prints `C:\src\brave-browser`.

## Step 5 — Run the Build (Takes 2-4 Hours)

From the `aether/` repository root:

```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\build.ps1 -Target Debug
```

This script reads `tools/gn/aether_args.gn`, runs GN to configure, then runs Ninja to compile.

**Monitor output:** Ninja prints progress as `N/TOTAL` files compiled. The build is complete when Ninja exits without errors.

## Step 6 — Verify the Build

```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\verify-build.ps1 -Target Debug
```

**Expected output:** All checks PASS. Browser launches and stays running for 5+ seconds.

## Step 7 — Manual Verification

Launch the browser manually:

```powershell
C:\src\brave-browser\src\out\AetherDebug\chrome.exe --no-sandbox
```

Confirm:
- [ ] Browser window opens
- [ ] Address bar is visible and accepts input
- [ ] Navigating to `https://example.com` loads the page
- [ ] No immediate crashes

## Step 8 — Record Build Baseline

Note your build time in `.aether/tools/build-log.txt` (create this file):

```
Date: YYYY-MM-DD
Build type: Debug
Target: AetherDebug
Ninja command duration: X hours Y minutes
Machine: CPU, RAM
Result: PASS
```

This baseline is useful for tracking if future changes slow down the build.

## Step 9 — Commit Batch 03

From the `aether/` repository root:

```powershell
git add tools/gn/aether_args.gn
git add tools/scripts/build.ps1
git add tools/scripts/clean.ps1
git add tools/scripts/update-brave.ps1
git add tools/scripts/apply-patches.ps1
git add tools/scripts/verify-build.ps1
git add docs/development/FIRST_BUILD_CHECKLIST.md
git add tools/gn/README.md
git commit -m "feat(build): add complete build system for Windows

Completes Batch 03 — Brave Fork Initialization.
Includes:

- GN build arguments (aether_args.gn) with development and release configs
- Complete build.ps1 with GN args parsing and ninja execution
- Complete clean.ps1 with size reporting and confirmation
- Complete update-brave.ps1 for upstream Brave updates
- Complete apply-patches.ps1 for Aether patch series management
- verify-build.ps1 for post-build health checking
- First build checklist documentation

First successful build verified on Windows.
Proceed to Batch 04 (Aether Identity)."
```

## Batch 03 Complete

Batch 03 is done when:
- [ ] `verify-build.ps1` reports all PASS
- [ ] Browser loads `https://example.com` successfully
- [ ] Batch 03 commit exists in git log
