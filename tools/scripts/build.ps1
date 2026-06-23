# Aether Browser â€” Windows Build Script
# Builds Aether for Windows using the Brave/Chromium build system.
# Usage: build.ps1 [-Target Debug|Release] [-ReconfigureOnly] [-Jobs <n>] [-Clean]
# Prerequisites: Complete docs/development/SETUP_WINDOWS.md and docs/development/BRAVE_FORK_GUIDE.md

param(
    [ValidateSet("Debug", "Release")]
    [string]$Target = "Debug",
    [switch]$ReconfigureOnly,
    [int]$Jobs = 0,
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$startTime = Get-Date

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "          Aether Browser Build Script              " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Target:           $Target" -ForegroundColor Cyan
Write-Host "ReconfigureOnly:  $ReconfigureOnly" -ForegroundColor Cyan
if ($Jobs -gt 0) {
    Write-Host "Parallel Jobs:    $Jobs" -ForegroundColor Cyan
} else {
    Write-Host "Parallel Jobs:    auto (all cores)" -ForegroundColor Cyan
}
Write-Host "Started at:       $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 1: Locate Brave source directory
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }

Write-Host "`n[1/7] Locating Brave source..." -ForegroundColor Green

if (-not (Test-Path $BraveSrc)) {
    Write-Host "[FAIL] Brave source directory not found at: $BraveSrc" -ForegroundColor Red
    Write-Host "Set the BRAVE_SRC environment variable to your brave-browser checkout path." -ForegroundColor Yellow
    Write-Host "See docs/development/BRAVE_FORK_GUIDE.md for setup instructions." -ForegroundColor Yellow
    exit 1
}

$chromiumSrc = Join-Path $BraveSrc "src"
if (-not (Test-Path $chromiumSrc)) {
    Write-Host "[FAIL] Brave source exists at $BraveSrc but src/ subdirectory not found." -ForegroundColor Red
    Write-Host "Run 'npm run init' inside $BraveSrc to fetch the Chromium source tree." -ForegroundColor Yellow
    exit 1
}

Write-Host "Brave source: $BraveSrc" -ForegroundColor Green
Write-Host "Chromium src: $chromiumSrc" -ForegroundColor Green

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 2: Determine output directory
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Write-Host "`n[2/7] Configuring output directory..." -ForegroundColor Green

$outDirName = if ($Target -eq "Release") { "AetherRelease" } else { "AetherDebug" }
$outDir = Join-Path $chromiumSrc "out\$outDirName"

Write-Host "Output directory: $outDir" -ForegroundColor Green

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 3: Handle -Clean flag
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

if ($Clean) {
    Write-Host "`n[CLEAN] Removing output directory: $outDir" -ForegroundColor Yellow
    if (Test-Path $outDir) {
        Remove-Item -Path $outDir -Recurse -Force
        Write-Host "[CLEAN] Output directory removed." -ForegroundColor Green
    } else {
        Write-Host "[CLEAN] Output directory does not exist. Nothing to clean." -ForegroundColor Yellow
    }
}

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 4: Parse GN args from aether_args.gn
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Write-Host "`n[3/7] Parsing GN build arguments..." -ForegroundColor Green

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$gnArgsFile = Join-Path $repoRoot "tools\gn\aether_args.gn"

if (-not (Test-Path $gnArgsFile)) {
    Write-Host "[FAIL] GN args file not found at: $gnArgsFile" -ForegroundColor Red
    exit 1
}

# Read aether_args.gn, strip comments and blank lines, preserve remaining lines verbatim
$gnArgsLines = Get-Content $gnArgsFile | Where-Object {
    $_.Trim() -ne "" -and -not $_.Trim().StartsWith("#")
}

# Apply release overrides if building for Release
$finalArgsLines = @()
$overrides = @{}
if ($Target -eq "Release") {
    Write-Host "Applying release build overrides..." -ForegroundColor Yellow
    $overrides["is_component_build"] = "false"
    $overrides["use_thin_lto"] = "true"
    $overrides["concurrent_links"] = "1"
    $overrides["symbol_level"] = "0"
}

foreach ($line in $gnArgsLines) {
    if ($line -match '^\s*(\S+)\s*=') {
        $key = $Matches[1]
        if ($overrides.ContainsKey($key)) {
            $finalArgsLines += "$key = $($overrides[$key])"
            $overrides.Remove($key)
            continue
        }
    }
    $finalArgsLines += $line
}
foreach ($key in $overrides.Keys) {
    $finalArgsLines += "$key = $($overrides[$key])"
}

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 5: Run GN to generate build files
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Write-Host "`n[4/7] Running prepare step..." -ForegroundColor Green
$prepareCommand = "node ./build/commands/scripts/commands.js build -C out\$outDirName --prepare_only"
Write-Host "Command: $prepareCommand" -ForegroundColor Cyan
Push-Location (Join-Path $chromiumSrc "brave")
try {
    & node ./build/commands/scripts/commands.js build -C out\$outDirName --prepare_only
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Prepare step failed with exit code $LASTEXITCODE" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "[FAIL] Prepare step threw an exception: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "`n[5/7] Running GN to generate build files..." -ForegroundColor Green

$outDirAbs = Join-Path $chromiumSrc "out\$outDirName"
New-Item -ItemType Directory -Force -Path $outDirAbs | Out-Null

# Write args directly as a real args.gn file
$argsGnPath = Join-Path $outDirAbs "args.gn"
[System.IO.File]::WriteAllLines($argsGnPath, $finalArgsLines)

Write-Host "Wrote GN args to: $argsGnPath" -ForegroundColor Cyan
Write-Host "--- args.gn content ---" -ForegroundColor Cyan
Get-Content $argsGnPath | ForEach-Object { Write-Host "  $_" }

Write-Host "Command: gn gen `"out\$outDirName`"" -ForegroundColor Cyan
Write-Host "Working directory: $chromiumSrc" -ForegroundColor Cyan

Push-Location $chromiumSrc
try {
    & gn gen "out\$outDirName"
    $gnExitCode = $LASTEXITCODE

    if ($gnExitCode -ne 0) {
        Write-Host "[FAIL] GN configuration failed with exit code $gnExitCode" -ForegroundColor Red
        Pop-Location
        exit 1
    }

    Write-Host "[PASS] GN configuration completed successfully." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] GN configuration threw an exception: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 6: Stop here if -ReconfigureOnly
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

if ($ReconfigureOnly) {
    Pop-Location
    $endTime = Get-Date
    $elapsed = $endTime - $startTime
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host "GN reconfiguration complete. Build files generated." -ForegroundColor Green
    Write-Host "Output directory: $outDir" -ForegroundColor Green
    Write-Host "Elapsed time: $($elapsed.ToString('hh\:mm\:ss'))" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    exit 0
}

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 7: Run Ninja to compile
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Write-Host "`n[6/7] Running Ninja to compile..." -ForegroundColor Green

$ninjaArgs = @("-C", "out\$outDirName", "chrome")

if ($Jobs -gt 0) {
    $ninjaArgs = @("-j", "$Jobs") + $ninjaArgs
    Write-Host "Ninja parallel jobs limited to: $Jobs" -ForegroundColor Yellow
}

$ninjaCommand = "ninja $($ninjaArgs -join ' ')"
Write-Host "Command: $ninjaCommand" -ForegroundColor Cyan
Write-Host "This may take several hours for a first build..." -ForegroundColor Yellow

try {
    & ninja @ninjaArgs
    $ninjaExitCode = $LASTEXITCODE

    if ($ninjaExitCode -ne 0) {
        Write-Host "[FAIL] Ninja build failed with exit code $ninjaExitCode" -ForegroundColor Red
        Write-Host "Check the build output above for specific compilation errors." -ForegroundColor Yellow
        Write-Host "Common fixes: see docs/development/TROUBLESHOOTING.md" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "[FAIL] Ninja build threw an exception: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Step 8: Report results
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Write-Host "`n[7/7] Verifying build output..." -ForegroundColor Green

$exePath = Join-Path $outDir "chrome.exe"
if (Test-Path $exePath) {
    $fileInfo = Get-Item $exePath
    $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    Write-Host "[PASS] Build successful." -ForegroundColor Green
    Write-Host "Executable: $exePath" -ForegroundColor Green
    Write-Host "Size: $sizeMB MB" -ForegroundColor Green
} else {
    Write-Host "[WARN] Build completed but chrome.exe not found at expected location." -ForegroundColor Yellow
    Write-Host "Expected: $exePath" -ForegroundColor Yellow
    Write-Host "The executable may have a different name. Check the output directory." -ForegroundColor Yellow
}

$endTime = Get-Date
$elapsed = $endTime - $startTime

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "          Aether Build Complete                    " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Target:       $Target" -ForegroundColor Green
Write-Host "Output:       $outDir" -ForegroundColor Green
Write-Host "Started:      $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Cyan
Write-Host "Finished:     $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Cyan
Write-Host "Elapsed:      $($elapsed.ToString('hh\:mm\:ss'))" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

exit 0
