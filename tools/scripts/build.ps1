# Aether Browser — Windows Build Script
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

# ─────────────────────────────────────────────────
# Step 1: Locate Brave source directory
# ─────────────────────────────────────────────────

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }

Write-Host "`n[1/6] Locating Brave source..." -ForegroundColor Green

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

# ─────────────────────────────────────────────────
# Step 2: Determine output directory
# ─────────────────────────────────────────────────

Write-Host "`n[2/6] Configuring output directory..." -ForegroundColor Green

$outDirName = if ($Target -eq "Release") { "AetherRelease" } else { "AetherDebug" }
$outDir = Join-Path $chromiumSrc "out\$outDirName"

Write-Host "Output directory: $outDir" -ForegroundColor Green

# ─────────────────────────────────────────────────
# Step 3: Handle -Clean flag
# ─────────────────────────────────────────────────

if ($Clean) {
    Write-Host "`n[CLEAN] Removing output directory: $outDir" -ForegroundColor Yellow
    if (Test-Path $outDir) {
        Remove-Item -Path $outDir -Recurse -Force
        Write-Host "[CLEAN] Output directory removed." -ForegroundColor Green
    } else {
        Write-Host "[CLEAN] Output directory does not exist. Nothing to clean." -ForegroundColor Yellow
    }
}

# ─────────────────────────────────────────────────
# Step 4: Parse GN args from aether_args.gn
# ─────────────────────────────────────────────────

Write-Host "`n[3/6] Parsing GN build arguments..." -ForegroundColor Green

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$gnArgsFile = Join-Path $repoRoot "tools\gn\aether_args.gn"

if (-not (Test-Path $gnArgsFile)) {
    Write-Host "[FAIL] GN args file not found at: $gnArgsFile" -ForegroundColor Red
    exit 1
}

# Read each line, skip comments and blank lines, collect key=value pairs
$gnLines = Get-Content $gnArgsFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) {
        # Skip comments and blank lines
    } else {
        $line
    }
} | Where-Object { $_ -ne $null }

# Build a hashtable for easy override
$argsMap = @{}
foreach ($line in $gnLines) {
    if ($line -match '^\s*(\S+)\s*=\s*(.+)$') {
        $argsMap[$Matches[1]] = $Matches[2]
    }
}

# Apply release overrides if building for Release
if ($Target -eq "Release") {
    Write-Host "Applying release build overrides..." -ForegroundColor Yellow
    $argsMap["is_component_build"] = "false"
    $argsMap["use_thin_lto"] = "true"
    $argsMap["concurrent_links"] = "1"
    $argsMap["symbol_level"] = "0"
}

# Construct the final GN args string
$gnArgsString = ($argsMap.GetEnumerator() | ForEach-Object { "$($_.Key) = $($_.Value)" }) -join " "

Write-Host "GN args: $gnArgsString" -ForegroundColor Cyan

# ─────────────────────────────────────────────────
# Step 5: Run GN to generate build files
# ─────────────────────────────────────────────────

Write-Host "`n[4/6] Running GN to generate build files..." -ForegroundColor Green

$gnCommand = "gn gen `"out\$outDirName`" --args=`"$gnArgsString`""
Write-Host "Command: $gnCommand" -ForegroundColor Cyan
Write-Host "Working directory: $chromiumSrc" -ForegroundColor Cyan

Push-Location $chromiumSrc
try {
    $gnResult = & gn gen "out\$outDirName" --args="$gnArgsString" 2>&1
    $gnExitCode = $LASTEXITCODE

    if ($gnExitCode -ne 0) {
        Write-Host "[FAIL] GN configuration failed with exit code $gnExitCode" -ForegroundColor Red
        Write-Host $gnResult -ForegroundColor Red
        Pop-Location
        exit 1
    }

    Write-Host $gnResult -ForegroundColor Green
    Write-Host "[PASS] GN configuration completed successfully." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] GN configuration threw an exception: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# ─────────────────────────────────────────────────
# Step 6: Stop here if -ReconfigureOnly
# ─────────────────────────────────────────────────

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

# ─────────────────────────────────────────────────
# Step 7: Run Ninja to compile
# ─────────────────────────────────────────────────

Write-Host "`n[5/6] Running Ninja to compile..." -ForegroundColor Green

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

# ─────────────────────────────────────────────────
# Step 8: Report results
# ─────────────────────────────────────────────────

Write-Host "`n[6/6] Verifying build output..." -ForegroundColor Green

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
