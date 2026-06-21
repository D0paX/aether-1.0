# Aether Browser — Environment Verification Script
# Read-only. This script checks your environment but does not modify it.
# Run this before starting the Brave fork setup.

$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "        Aether Build Environment Verification      " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$script:passed = 0
$script:failed = 0
$script:warnings = 0
$total = 15

function Print-Pass($name, $details) {
    Write-Host "[PASS] " -ForegroundColor Green -NoNewline
    Write-Host "$($name): $details"
    $script:passed++
}

function Print-Fail($name, $details) {
    Write-Host "[FAIL] " -ForegroundColor Red -NoNewline
    Write-Host "$($name): $details"
    $script:failed++
}

function Print-Warn($name, $details) {
    Write-Host "[WARN] " -ForegroundColor Yellow -NoNewline
    Write-Host "$($name): $details"
    $script:warnings++
}

# 1. Long path support check
$regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
$longPaths = $null
if (Test-Path $regPath) {
    $longPaths = (Get-ItemProperty $regPath -Name "LongPathsEnabled" -ErrorAction SilentlyContinue).LongPathsEnabled
}
if ($longPaths -eq 1) {
    Print-Pass "Long path support" "Enabled"
} else {
    Print-Fail "Long path support" "Disabled or not configured in registry"
}

# 2. Windows version check
$os = [System.Environment]::OSVersion
$build = $os.Version.Build
if ($os.Platform -eq "Win32NT" -and $os.Version.Major -eq 10 -and $build -ge 19045) {
    Print-Pass "Windows version" "Build $build (Compatible)"
} else {
    Print-Fail "Windows version" "Build $build (Requires Windows 10 build 19045+ or Windows 11)"
}

# 3. Visual Studio 2022 detection
# Also checks Program Files (x86) for Build Tools edition, which installs
# under the x86 path even though the MSVC toolset itself is 64-bit.
$vsPath = $null
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    $vsPath = & $vswhere -version "[17.0,18.0)" -property installationPath
}
if (-not $vsPath) {
    $commonPaths = @(
        "C:\Program Files\Microsoft Visual Studio\2022\Community",
        "C:\Program Files\Microsoft Visual Studio\2022\Professional",
        "C:\Program Files\Microsoft Visual Studio\2022\Enterprise",
        "C:\Program Files\Microsoft Visual Studio\2022\BuildTools",
        "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"
    )
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $vsPath = $path
            break
        }
    }
}
if ($vsPath) {
    Print-Pass "Visual Studio 2022" "Detected at $vsPath"
} else {
    Print-Fail "Visual Studio 2022" "Installation not found"
}

# 4. MSVC compiler (cl.exe) verification
$clFound = $false
$clPath = ""
if ($vsPath) {
    $msvcRoot = Join-Path $vsPath "VC\Tools\MSVC"
    if (Test-Path $msvcRoot) {
        $clExecutables = Get-ChildItem -Path $msvcRoot -Filter "cl.exe" -Recurse -ErrorAction SilentlyContinue
        foreach ($cl in $clExecutables) {
            if ($cl.FullName -match "bin\\Hostx64\\x64\\cl.exe" -or $cl.FullName -match "bin\\HostX64\\x64\\cl.exe") {
                $clFound = $true
                $clPath = $cl.FullName
                break
            }
        }
        if (-not $clFound -and $clExecutables.Count -gt 0) {
            $clFound = $true
            $clPath = $clExecutables[0].FullName
        }
    }
}
if ($clFound) {
    Print-Pass "MSVC compiler (cl.exe)" "Detected at $clPath"
} else {
    Print-Fail "MSVC compiler (cl.exe)" "Compiler executable not found under Visual Studio path"
}

# 5. Windows SDK check
$sdkVersions = @()
$sdkRegPath = "HKLM:\SOFTWARE\Microsoft\Windows Kits\Installed Roots"
if (Test-Path $sdkRegPath) {
    $sdkRoot = (Get-ItemProperty $sdkRegPath -Name "KitsRoot10" -ErrorAction SilentlyContinue).KitsRoot10
    if ($sdkRoot -and (Test-Path (Join-Path $sdkRoot "Include"))) {
        $dirs = Get-ChildItem (Join-Path $sdkRoot "Include") -Directory -ErrorAction SilentlyContinue
        foreach ($d in $dirs) {
            if ($d.Name -match "^10\.") {
                $sdkVersions += [version]$d.Name
            }
        }
    }
}
if ($sdkVersions.Count -eq 0 -and (Test-Path "C:\Program Files (x86)\Windows Kits\10\Include")) {
    $dirs = Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\Include" -Directory -ErrorAction SilentlyContinue
    foreach ($d in $dirs) {
        if ($d.Name -match "^10\.") {
            $sdkVersions += [version]$d.Name
        }
    }
}

$sdkPass = $false
$maxSdk = "None Detected"
if ($sdkVersions.Count -gt 0) {
    $sorted = $sdkVersions | Sort-Object -Descending
    $maxSdkObj = $sorted[0]
    $maxSdk = $maxSdkObj.ToString()
    if ($maxSdkObj -ge [version]"10.0.20348.0") {
        $sdkPass = $true
    }
}

if ($sdkPass) {
    Print-Pass "Windows SDK" "Version $maxSdk"
} else {
    Print-Fail "Windows SDK" "Version $maxSdk (Requires Windows 10 SDK 10.0.20348.0+ or Windows 11 SDK)"
}

# 6. Git check
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
$gitPass = $false
$gitVer = "Not found"
if ($gitCmd) {
    $gitOutput = (git --version)
    if ($gitOutput -match "git version (\d+\.\d+\.\d+)") {
        $gitVer = $Matches[1]
        if ([version]$gitVer -ge [version]"2.40.0") {
            $gitPass = $true
        }
    }
}
if ($gitPass) {
    Print-Pass "Git" "version $gitVer"
} else {
    Print-Fail "Git" "version $gitVer (Requires git 2.40.0+)"
}

# 7. Python check
# depot_tools bundles its own python3 (python3.bat), which is what the
# Chromium build actually uses. We check python3 first, then fall back
# to bare python. The Windows Store stub for 'python' is not valid.
$pyPass = $false
$pyVer = "Not found"
$pySource = ""
$pyCmd = Get-Command python3 -ErrorAction SilentlyContinue
if (-not $pyCmd) {
    $pyCmd = Get-Command python -ErrorAction SilentlyContinue
}
if ($pyCmd) {
    $pySource = $pyCmd.Source
    # Skip the Windows Store stub — it has no real Python behind it
    if ($pySource -notlike "*WindowsApps*") {
        $pyOutput = & $pyCmd.Name --version 2>&1
        if ($pyOutput -match "Python (\d+\.\d+\.\d+)") {
            $pyVer = $Matches[1]
            $pyVerObj = [version]$pyVer
            if ($pyVerObj -ge [version]"3.9.0" -and $pyVerObj -lt [version]"3.13.0") {
                $pyPass = $true
            }
        }
    }
}
if ($pyPass) {
    Print-Pass "Python" "version $pyVer ($pySource)"
} else {
    Print-Fail "Python" "version $pyVer (Requires python3 3.9.x - 3.12.x, or depot_tools bundled python3)"
}

# 8. Node.js check
# Aether uses a dual-node strategy managed by nvm-windows:
#   Node 24.x — brave-core sync/build commands (npm run init, gclient, etc.)
#   Node 22.x — pnpm webui:* commands (WebUI dev/build)
# Either version satisfies this check; both should be installed via nvm.
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$nodePass = $false
$nodeVer = "Not found"
if ($nodeCmd) {
    $nodeOutput = node --version
    if ($nodeOutput -match "v(2[024]\.\d+\.\d+)") {
        $nodeVer = $Matches[1]
        $nodePass = $true
    } else {
        $nodeVer = $nodeOutput.Trim()
    }
}
if ($nodePass) {
    Print-Pass "Node.js" "version $nodeVer"
} else {
    Print-Fail "Node.js" "version $nodeVer (Requires v20.x.x, v22.x.x, or v24.x.x)"
}

# 9. pnpm check
$pnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
$pnpmPass = $false
$pnpmVer = "Not found"
if ($pnpmCmd) {
    $pnpmOutput = pnpm --version
    if ($pnpmOutput -match "^9\.") {
        $pnpmVer = $pnpmOutput.Trim()
        $pnpmPass = $true
    } else {
        $pnpmVer = $pnpmOutput.Trim()
    }
}
if ($pnpmPass) {
    Print-Pass "pnpm" "version $pnpmVer"
} else {
    Print-Fail "pnpm" "version $pnpmVer (Requires 9.x.x)"
}

# 10. depot_tools directory check
# Accepts depot_tools at the standard C:\depot_tools location or vendored
# inside the brave-browser checkout (which is what Brave's npm run init uses).
$depotToolsPath = $null
if (Test-Path "C:\depot_tools") {
    $depotToolsPath = "C:\depot_tools"
} elseif ($env:BRAVE_SRC -and (Test-Path "$env:BRAVE_SRC\src\brave\vendor\depot_tools")) {
    $depotToolsPath = "$env:BRAVE_SRC\src\brave\vendor\depot_tools"
} elseif (Test-Path "E:\src\brave-browser\src\brave\vendor\depot_tools") {
    $depotToolsPath = "E:\src\brave-browser\src\brave\vendor\depot_tools"
}
if ($depotToolsPath) {
    Print-Pass "depot_tools Directory" "Found at $depotToolsPath"
} else {
    Print-Fail "depot_tools Directory" "Missing (checked C:\depot_tools and vendored path)"
}

# 11. depot_tools on PATH (gclient)
$gclientCmd = Get-Command gclient -ErrorAction SilentlyContinue
$gclientPass = $false
if ($gclientCmd) {
    $gclientPass = $true
}
if ($gclientPass) {
    Print-Pass "depot_tools on PATH" "Executable gclient found"
} else {
    Print-Fail "depot_tools on PATH" "gclient executable not found on active PATH"
}

# 12. DEPOT_TOOLS_WIN_TOOLCHAIN variable check
# Check both Machine (HKLM) and User (HKCU) scopes, since this project
# uses user-scoped variables when running in a non-elevated terminal.
$toolchain = [Environment]::GetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "Machine")
if (-not $toolchain) {
    $toolchain = [Environment]::GetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "User")
}
if (-not $toolchain -and $env:DEPOT_TOOLS_WIN_TOOLCHAIN) {
    $toolchain = $env:DEPOT_TOOLS_WIN_TOOLCHAIN
}
if ($toolchain -eq "0") {
    Print-Pass "DEPOT_TOOLS_WIN_TOOLCHAIN" "Configured to 0"
} else {
    Print-Fail "DEPOT_TOOLS_WIN_TOOLCHAIN" "Value is '$toolchain' (Requires 0)"
}

# 13. vs2022_install variable check
# Check both Machine and User scopes, plus the active session.
$vsInstallVar = [Environment]::GetEnvironmentVariable("vs2022_install", "Machine")
if (-not $vsInstallVar) {
    $vsInstallVar = [Environment]::GetEnvironmentVariable("vs2022_install", "User")
}
if (-not $vsInstallVar -and $env:vs2022_install) {
    $vsInstallVar = $env:vs2022_install
}
$vsInstallPass = $false
if ($vsInstallVar -and (Test-Path $vsInstallVar)) {
    $vsInstallPass = $true
}
if ($vsInstallPass) {
    Print-Pass "vs2022_install Variable" "Configured to $vsInstallVar"
} else {
    Print-Fail "vs2022_install Variable" "Not set or points to invalid directory (Value: '$vsInstallVar')"
}

# 14. Available disk space check
# If BRAVE_SRC is set, check free space on that drive (the actual build drive)
# instead of hardcoding C:. The build tree and artifacts live on this drive.
$targetDrive = "C:"
if ($env:BRAVE_SRC) {
    $targetDrive = [System.IO.Path]::GetPathRoot($env:BRAVE_SRC)
} elseif (Test-Path "E:\src") {
    $targetDrive = "E:\"
}
$driveLetter = $targetDrive.Replace(":", "").Replace("\", "")
$driveInfo = Get-PSDrive -Name $driveLetter -ErrorAction SilentlyContinue
$freeGB = 0
if ($driveInfo) {
    $freeGB = [math]::Round($driveInfo.Free / 1GB, 2)
} else {
    $disk = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='${driveLetter}:'" -ErrorAction SilentlyContinue
    if ($disk) {
        $freeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    }
}
if ($freeGB -ge 100) {
    Print-Pass "Available disk space" "$freeGB GB free on $targetDrive"
} elseif ($freeGB -ge 50) {
    Print-Warn "Available disk space" "$freeGB GB free on $targetDrive (100+ GB recommended for debug builds)"
} else {
    Print-Fail "Available disk space" "$freeGB GB free on $targetDrive (Requires 50 GB minimum)"
}

# 15. Total physical RAM check
# Windows reserves some physical memory for hardware/firmware, so 16 GB
# physical RAM typically reports as ~15.7 GB available to the OS.
# PASS at >=16, WARN at >=14 (accounts for OS overhead), FAIL below 14.
$ramBytes = (Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory
$ramGB = [math]::Round($ramBytes / 1GB, 2)
if ($ramGB -ge 32) {
    Print-Pass "Available RAM" "$ramGB GB (Optimal)"
} elseif ($ramGB -ge 16) {
    Print-Pass "Available RAM" "$ramGB GB"
} elseif ($ramGB -ge 14) {
    Print-Warn "Available RAM" "$ramGB GB (16 GB nominal, but OS overhead likely accounts for the gap)"
} else {
    Print-Fail "Available RAM" "$ramGB GB (Requires 14 GB minimum usable, 16 GB nominal)"
}

# Final Report Summary
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "             Verification Summary               " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Total checks: $total"
Write-Host "Passed:       $script:passed" -ForegroundColor Green
Write-Host "Failed:       $script:failed" -ForegroundColor Red
Write-Host "Warnings:     $script:warnings" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

if ($script:failed -gt 0) {
    Write-Host "Environment is not ready. Fix the failed checks before proceeding to BRAVE_FORK_GUIDE.md." -ForegroundColor Red
    Exit 1
} else {
    Write-Host "Environment verified. Proceed to docs/development/BRAVE_FORK_GUIDE.md." -ForegroundColor Green
    Exit 0
}
