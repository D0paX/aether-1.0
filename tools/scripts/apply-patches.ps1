# Aether Browser — Apply Aether Patches to Brave Fork
# Applies the Aether patch series from tools/patches/ to the Brave source.
# Full implementation added in Batch 04 (Aether Identity).
# Usage: apply-patches.ps1

$ErrorActionPreference = "Stop"

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }
$PatchDir = Join-Path $PSScriptRoot "..\..\tools\patches"
$SeriesFile = Join-Path $PatchDir "series"

if (-not (Test-Path $SeriesFile)) {
    Write-Host "[INFO] No patches to apply. tools/patches/series is empty." -ForegroundColor Cyan
    exit 0
}

Write-Host "Patch application not yet fully implemented. Complete Batch 04 first." -ForegroundColor Yellow
exit 0
