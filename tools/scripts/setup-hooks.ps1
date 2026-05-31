# Aether Browser — Git Hooks Setup
# Run this script once after cloning the repository to install git hooks.
# This script is safe to run multiple times.

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$hooksDir = Join-Path $repoRoot ".git\hooks"
$sourceDir = Join-Path $repoRoot "tools\hooks"

if (-not (Test-Path $hooksDir)) {
    Write-Host "[FAIL] .git/hooks directory not found. Is this a git repository?" -ForegroundColor Red
    exit 1
}

# Install commit-msg hook
Copy-Item "$sourceDir\commit-msg" "$hooksDir\commit-msg" -Force
Write-Host "[PASS] commit-msg hook installed" -ForegroundColor Green

# Install pre-commit hook
Copy-Item "$sourceDir\pre-commit" "$hooksDir\pre-commit" -Force
Write-Host "[PASS] pre-commit hook installed" -ForegroundColor Green

Write-Host ""
Write-Host "Git hooks installed successfully." -ForegroundColor Green
