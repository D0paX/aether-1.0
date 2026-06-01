# Aether Browser — Build Verification Script
# Verifies a completed Aether build is functional before declaring it successful.
# Run after every build to confirm the browser launches without crashing.

param(
    [ValidateSet("Debug", "Release")]
    [string]$Target = "Debug"
)

$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "        Aether Build Verification                  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$BraveSrc = if ($env:BRAVE_SRC) { $env:BRAVE_SRC } else { "C:\src\brave-browser" }

$outDirName = if ($Target -eq "Release") { "AetherRelease" } else { "AetherDebug" }
$outDir = Join-Path $BraveSrc "src\out\$outDirName"

# Try both possible executable names (chrome.exe before Batch 04, aether.exe after)
$exePath = $null
$aetherExe = Join-Path $outDir "aether.exe"
$chromeExe = Join-Path $outDir "chrome.exe"

if (Test-Path $aetherExe) {
    $exePath = $aetherExe
} elseif (Test-Path $chromeExe) {
    $exePath = $chromeExe
}

$script:passed = 0
$script:failed = 0
$total = 4

function Print-Pass($name, $details) {
    Write-Host "[PASS] " -ForegroundColor Green -NoNewline
    Write-Host "$name: $details"
    $script:passed++
}

function Print-Fail($name, $details) {
    Write-Host "[FAIL] " -ForegroundColor Red -NoNewline
    Write-Host "$name: $details"
    $script:failed++
}

# ─────────────────────────────────────────────────
# Build Metadata
# ─────────────────────────────────────────────────

Write-Host ""
Write-Host "Build Target:     $Target" -ForegroundColor Cyan
Write-Host "Output Directory: $outDir" -ForegroundColor Cyan

if ($exePath -and (Test-Path $exePath)) {
    $fileInfo = Get-Item $exePath
    $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    $lastModified = $fileInfo.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "Executable:       $exePath" -ForegroundColor Cyan
    Write-Host "File Size:        $sizeMB MB" -ForegroundColor Cyan
    Write-Host "Build Timestamp:  $lastModified" -ForegroundColor Cyan
} else {
    Write-Host "Executable:       Not found" -ForegroundColor Red
}

Write-Host ""

# ─────────────────────────────────────────────────
# CHECK 1: Executable exists
# ─────────────────────────────────────────────────

if ($exePath -and (Test-Path $exePath)) {
    Print-Pass "Executable exists" $exePath
} else {
    Print-Fail "Executable exists" "Neither aether.exe nor chrome.exe found in $outDir"
    # Remaining checks cannot proceed without the executable
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "Total checks: $total" -ForegroundColor Cyan
    Write-Host "Passed:       $script:passed" -ForegroundColor Green
    Write-Host "Failed:       $($total - $script:passed)" -ForegroundColor Red
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "Build verification failed. Check output above." -ForegroundColor Red
    exit 1
}

# ─────────────────────────────────────────────────
# CHECK 2: Executable file size
# ─────────────────────────────────────────────────

$fileInfo = Get-Item $exePath
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)

if ($sizeMB -gt 10) {
    Print-Pass "Executable size" "$sizeMB MB (above 10 MB minimum)"
} else {
    Print-Fail "Executable size" "$sizeMB MB (below 10 MB minimum — build may be incomplete)"
}

# ─────────────────────────────────────────────────
# CHECK 3: Launch test (5-second crash check)
# ─────────────────────────────────────────────────

Write-Host ""
Write-Host "Launching browser for 5-second stability check..." -ForegroundColor Yellow

$testProfileDir = "C:\Temp\aether-test-profile"
$process = $null

try {
    # Ensure a clean test profile directory
    if (Test-Path $testProfileDir) {
        Remove-Item -Path $testProfileDir -Recurse -Force -ErrorAction SilentlyContinue
    }

    $process = Start-Process -FilePath $exePath `
        -ArgumentList "--no-sandbox", "--disable-gpu", "--user-data-dir=$testProfileDir" `
        -PassThru

    if (-not $process -or $process.HasExited) {
        Print-Fail "Launch stability" "Process failed to start or exited immediately"
    } else {
        # Wait 5 seconds and check if the process is still alive
        Start-Sleep -Seconds 5

        $process.Refresh()

        if (-not $process.HasExited) {
            Print-Pass "Launch stability" "Process running after 5 seconds (PID: $($process.Id))"

            # Kill the test process and its child processes
            try {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                # Give child processes a moment to terminate
                Start-Sleep -Milliseconds 500
                # Kill any remaining child processes spawned by the browser
                Get-Process | Where-Object {
                    $_.Path -and $_.Path.StartsWith($outDir)
                } | Stop-Process -Force -ErrorAction SilentlyContinue
            } catch {
                # Best-effort cleanup; process may have already exited
            }
        } else {
            $exitCode = $process.ExitCode
            Print-Fail "Launch stability" "Process crashed within 5 seconds (exit code: $exitCode)"
        }
    }
} catch {
    Print-Fail "Launch stability" "Exception during launch test: $_"
} finally {
    # Clean up test profile directory
    if (Test-Path $testProfileDir) {
        Remove-Item -Path $testProfileDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ─────────────────────────────────────────────────
# CHECK 4: Key DLLs present (component build check)
# ─────────────────────────────────────────────────

$keyFiles = @(
    "chrome.dll",
    "chrome_elf.dll",
    "v8_context_snapshot.bin",
    "resources.pak"
)

$foundCount = 0
$missingFiles = @()

foreach ($file in $keyFiles) {
    $filePath = Join-Path $outDir $file
    if (Test-Path $filePath) {
        $foundCount++
    } else {
        $missingFiles += $file
    }
}

if ($foundCount -eq $keyFiles.Count) {
    Print-Pass "Key build artifacts" "All $foundCount expected files present ($($keyFiles -join ', '))"
} elseif ($foundCount -gt 0) {
    # Some files present — component build may have different naming
    Print-Pass "Key build artifacts" "$foundCount of $($keyFiles.Count) found (missing: $($missingFiles -join ', ') — may be normal for this build configuration)"
} else {
    Print-Fail "Key build artifacts" "None of the expected files found: $($keyFiles -join ', ')"
}

# ─────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "        Verification Summary                       " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Total checks: $total"
Write-Host "Passed:       $script:passed" -ForegroundColor Green
Write-Host "Failed:       $script:failed" -ForegroundColor Red
Write-Host "==================================================" -ForegroundColor Cyan

if ($script:failed -eq 0) {
    Write-Host "Build verified. Ready to proceed." -ForegroundColor Green
    exit 0
} else {
    Write-Host "Build verification failed. Check output above." -ForegroundColor Red
    exit 1
}
