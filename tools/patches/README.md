# Aether Patches

This directory contains Aether's patches on top of the Brave fork.

## What This Is

Aether modifies the Brave/Chromium source to implement Aether-specific features, remove Brave-specific product features, and establish Aether's identity. These modifications are tracked as a series of git patch files rather than as direct commits to the Brave source.

Why patches instead of a submodule or direct fork commits?
- Patches are portable: they can be applied to any Brave version.
- Patches are reviewable: each patch has a clear purpose and scope.
- Patches are rebaseable: when Brave updates, patches can be reapplied.
- Patches keep the Brave checkout clean for upstream comparison.

## Patch Naming Convention

Patches are numbered sequentially with a descriptive name:
0001-aether-identity.patch          # Product rename: Brave -> Aether
0002-remove-brave-wallet.patch      # Remove Brave Wallet
0003-remove-brave-rewards.patch     # Remove Brave Rewards
0004-remove-brave-news.patch        # Remove Brave News
0005-remove-brave-ads.patch         # Remove Brave Ads integration

Patches are applied in the order defined in the `series` file.

## Adding a New Patch

1. Make your changes in the Brave source directory.
2. Stage the changed files: `git add <files>`
3. Create the patch: `git diff --cached > 00XX-description.patch`
4. Move the patch file to `aether/tools/patches/`
5. Add the filename to `aether/tools/patches/series` in the correct position.
6. Commit the patch file and updated series to the `aether/` repository.

## Applying All Patches
```powershell
powershell -ExecutionPolicy Bypass -File tools\scripts\apply-patches.ps1
```

## Rebase Workflow (after a Brave upstream update)

1. Update Brave: `powershell -ExecutionPolicy Bypass -File tools\scripts\update-brave.ps1`
2. If patches apply cleanly: verify build and commit.
3. If patches conflict: resolve conflicts, update the patch file, commit the updated patch.
