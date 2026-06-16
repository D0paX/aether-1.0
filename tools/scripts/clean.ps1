# Aether Browser — Clean Build Artifacts
# Removes Chromium build output to free disk space.
# Usage: clean.ps1 [-Target Debug|Release] [-All] [-Force]
# WARNING: Full clean requires a complete rebuild (2-4 hours).

param(
    [ValidateSet("Debug", "Release")]
    [string]$Target = "Debug",
    [switch]$All,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }
$chromiumSrc = Join-Path $BraveSrc "src"

if (-not (Test-Path $chromiumSrc)) {
    Write-Host "[FAIL] Brave source directory not found at $BraveSrc" -ForegroundColor Red
    exit 1
}

$dirsToClean = @()
if ($All) {
    $dirsToClean += Join-Path $chromiumSrc "out\AetherDebug"
    $dirsToClean += Join-Path $chromiumSrc "out\AetherRelease"
} else {
    $outDirName = if ($Target -eq "Release") { "AetherRelease" } else { "AetherDebug" }
    $dirsToClean += Join-Path $chromiumSrc "out\$outDirName"
}

# Filter to directories that actually exist
$existingDirs = $dirsToClean | Where-Object { Test-Path $_ }

if ($existingDirs.Count -eq 0) {
    Write-Host "No build output directories found to clean." -ForegroundColor Green
    exit 0
}

# Calculate sizes
$totalBytes = 0
foreach ($dir in $existingDirs) {
    Write-Host "Calculating size of $dir..." -ForegroundColor Yellow
    $files = Get-ChildItem -Path $dir -Recurse -File -ErrorAction SilentlyContinue
    $size = ($files | Measure-Object -Property Length -Sum).Sum
    if ($size) {
        $totalBytes += $size
        $sizeGB = [math]::Round($size / 1GB, 2)
        Write-Host "  $dir: $sizeGB GB" -ForegroundColor Cyan
    } else {
        Write-Host "  $dir: empty or does not exist" -ForegroundColor Cyan
    }
}

$totalGB = [math]::Round($totalBytes / 1GB, 2)
Write-Host "Total space to reclaim: $totalGB GB" -ForegroundColor Yellow

if (-not $Force) {
    $confirm = Read-Host "Are you sure you want to delete these directories? (y/N)"
    if ($confirm -notmatch '^[yY]') {
        Write-Host "Clean cancelled." -ForegroundColor Yellow
        exit 0
    }
}

foreach ($dir in $existingDirs) {
    Write-Host "Removing $dir..." -ForegroundColor Yellow
    try {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "[PASS] Successfully removed $dir" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to remove $dir: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Clean completed successfully. Reclaimed $totalGB GB." -ForegroundColor Green
exit 0
