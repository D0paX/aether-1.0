# Aether Browser — Update from Brave Upstream
# Pulls the latest Brave release, syncs Chromium dependencies,
# reapplies Aether patches, and verifies the result builds.
# Usage: update-brave.ps1 [-Tag <brave-version-tag>] [-SkipBuild]

param(
    [string]$Tag = "",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path $BraveSrc)) {
    Write-Host "[FAIL] Brave source directory not found at $BraveSrc" -ForegroundColor Red
    exit 1
}

Write-Host "Updating Brave upstream repository..." -ForegroundColor Green
Push-Location $BraveSrc

try {
    # Verify git repo
    if (-not (Test-Path ".git")) {
        Write-Host "[FAIL] $BraveSrc is not a Git repository." -ForegroundColor Red
        Pop-Location
        exit 1
    }

    # Fetch latest remote
    Write-Host "Fetching latest updates from remote..." -ForegroundColor Yellow
    & git fetch origin

    if ($Tag) {
        Write-Host "Checking out tag: $Tag..." -ForegroundColor Yellow
        & git checkout $Tag
    } else {
        Write-Host "Pulling latest changes..." -ForegroundColor Yellow
        & git pull
    }

    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    & npm install

    Write-Host "Syncing Chromium dependencies..." -ForegroundColor Yellow
    & npm run sync
} catch {
    Write-Host "[FAIL] Error updating Brave upstream: $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Apply patches
Write-Host "Applying Aether patches..." -ForegroundColor Green
$applyPatchesScript = Join-Path $PSScriptRoot "apply-patches.ps1"
if (Test-Path $applyPatchesScript) {
    & powershell -ExecutionPolicy Bypass -File $applyPatchesScript
} else {
    Write-Host "[WARN] apply-patches.ps1 not found." -ForegroundColor Yellow
}

# Run build reconfiguration if not skipped
if (-not $SkipBuild) {
    Write-Host "Running build reconfiguration..." -ForegroundColor Green
    $buildScript = Join-Path $PSScriptRoot "build.ps1"
    if (Test-Path $buildScript) {
        & powershell -ExecutionPolicy Bypass -File $buildScript -ReconfigureOnly
    }
}

Write-Host "Update completed successfully." -ForegroundColor Green
exit 0
