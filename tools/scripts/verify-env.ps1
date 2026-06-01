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
$vsPath = $null
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    $vsPath = & $vswhere -version "[17.0,18.0)" -property installationPath
}
if (-not $vsPath) {
    $commonPaths = @(
        "C:\Program Files\Microsoft Visual Studio\2022\Community",
        "C:\Program Files\Microsoft Visual Studio\2022\Professional",
        "C:\Program Files\Microsoft Visual Studio\2022\Enterprise"
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
$pyCmd = Get-Command python -ErrorAction SilentlyContinue
$pyPass = $false
$pyVer = "Not found"
if ($pyCmd) {
    $pyOutput = python --version 2>&1
    if ($pyOutput -match "Python (\d+\.\d+\.\d+)") {
        $pyVer = $Matches[1]
        $pyVerObj = [version]$pyVer
        if ($pyVerObj -ge [version]"3.9.0" -and $pyVerObj -lt [version]"3.12.0") {
            $pyPass = $true
        }
    }
}
if ($pyPass) {
    Print-Pass "Python" "version $pyVer"
} else {
    Print-Fail "Python" "version $pyVer (Requires version 3.9.x - 3.11.x)"
}

# 8. Node.js check
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$nodePass = $false
$nodeVer = "Not found"
if ($nodeCmd) {
    $nodeOutput = node --version
    if ($nodeOutput -match "v(20\.\d+\.\d+)") {
        $nodeVer = $Matches[1]
        $nodePass = $true
    } else {
        $nodeVer = $nodeOutput.Trim()
    }
}
if ($nodePass) {
    Print-Pass "Node.js" "version $nodeVer"
} else {
    Print-Fail "Node.js" "version $nodeVer (Requires v20.x.x)"
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
if (Test-Path "C:\depot_tools") {
    Print-Pass "depot_tools Directory" "Found at C:\depot_tools"
} else {
    Print-Fail "depot_tools Directory" "Missing at C:\depot_tools"
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
$toolchain = [Environment]::GetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "Machine")
if ($toolchain -eq "0") {
    Print-Pass "DEPOT_TOOLS_WIN_TOOLCHAIN" "Configured to 0"
} else {
    Print-Fail "DEPOT_TOOLS_WIN_TOOLCHAIN" "Value is '$toolchain' (Requires 0)"
}

# 13. vs2022_install variable check
$vsInstallVar = [Environment]::GetEnvironmentVariable("vs2022_install", "Machine")
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
$targetDrive = "C:"
if (Test-Path "C:\src") {
    $targetDrive = [System.IO.Path]::GetPathRoot("C:\src")
}
$driveInfo = Get-PSDrive -Name $targetDrive.Replace(":", "").Replace("\", "") -ErrorAction SilentlyContinue
$freeGB = 0
if ($driveInfo) {
    $freeGB = [math]::Round($driveInfo.Free / 1GB, 2)
} else {
    $disk = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='$targetDrive'" -ErrorAction SilentlyContinue
    if ($disk) {
        $freeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    }
}
if ($freeGB -ge 300) {
    Print-Pass "Available disk space" "$freeGB GB free on $targetDrive"
} else {
    Print-Fail "Available disk space" "$freeGB GB free on $targetDrive (Requires 300 GB free)"
}

# 15. Total physical RAM check
$ramBytes = (Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory
$ramGB = [math]::Round($ramBytes / 1GB, 2)
if ($ramGB -ge 32) {
    Print-Pass "Available RAM" "$ramGB GB (Optimal)"
} elseif ($ramGB -ge 16) {
    Print-Warn "Available RAM" "$ramGB GB (Minimum is 16 GB, but 32 GB is recommended)"
} else {
    Print-Fail "Available RAM" "$ramGB GB (Requires 16 GB minimum)"
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
