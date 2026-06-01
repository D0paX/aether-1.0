# Aether Browser — Apply Aether Patches to Brave Fork
# Applies the Aether patch series from tools/patches/ to the Brave source.
# Usage: apply-patches.ps1

$ErrorActionPreference = "Stop"

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }
$chromiumSrc = Join-Path $BraveSrc "src"
$PatchDir = Join-Path $PSScriptRoot "..\patches"
$SeriesFile = Join-Path $PatchDir "series"

if (-not (Test-Path $SeriesFile)) {
    Write-Host "[INFO] No patches to apply. tools/patches/series is empty or missing." -ForegroundColor Cyan
    exit 0
}

Write-Host "Applying Aether patches to Chromium/Brave repository..." -ForegroundColor Green
Write-Host "Patch directory: $PatchDir" -ForegroundColor Cyan
Write-Host "Target:          $chromiumSrc" -ForegroundColor Cyan

if (-not (Test-Path $chromiumSrc)) {
    Write-Host "[FAIL] Chromium source directory not found at $chromiumSrc" -ForegroundColor Red
    exit 1
}

$patches = Get-Content $SeriesFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) {
        # Skip comments and blank lines
    } else {
        $line
    }
} | Where-Object { $_ -ne $null }

if ($patches.Count -eq 0) {
    Write-Host "[INFO] No active patches listed in tools/patches/series." -ForegroundColor Cyan
    exit 0
}

Push-Location $chromiumSrc
try {
    # Check if there is an active rebase/am in progress
    if (Test-Path ".git/rebase-apply") {
        Write-Host "[WARN] Active git am/rebase found. Aborting existing application..." -ForegroundColor Yellow
        & git am --abort 2>$null
    }

    foreach ($patchName in $patches) {
        $patchFile = Join-Path $PatchDir $patchName
        if (-not (Test-Path $patchFile)) {
            Write-Host "[FAIL] Patch file not found: $patchFile" -ForegroundColor Red
            Pop-Location
            exit 1
        }

        Write-Host "Applying: $patchName..." -ForegroundColor Yellow
        
        # Dry run/check first
        & git apply --check $patchFile 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[WARN] Dry run failed for patch: $patchName. Forcing application..." -ForegroundColor Yellow
        }

        # Apply using git am
        $amResult = & git am --keep-cr $patchFile 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[FAIL] Failed to apply patch $patchName. Command output:" -ForegroundColor Red
            Write-Host $amResult -ForegroundColor Red
            Write-Host "Aborting git am..." -ForegroundColor Yellow
            & git am --abort
            Pop-Location
            exit 1
        }
        Write-Host "[PASS] Applied: $patchName" -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Exception during patch application: $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

Write-Host "All patches applied successfully." -ForegroundColor Green
exit 0
