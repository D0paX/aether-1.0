# Aether Browser — Windows Development Environment Setup Script
# Run as Administrator. See docs/development/SETUP_WINDOWS.md for full context.

# Set error action to stop script immediately on error
$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "        Aether Windows Build Environment Setup     " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Check if running as Administrator
Write-Host "Checking administrative privileges..." -ForegroundColor Cyan
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Error: This script must be run as Administrator." -ForegroundColor Red
    Write-Host "Please relaunch PowerShell as Administrator and execute this script again." -ForegroundColor Red
    Exit 1
}
Write-Host "Running with administrative privileges." -ForegroundColor Green

$global:RequiresRestart = $false
$global:RequiresTerminalRestart = $false
$global:VSInstallPath = $null

# 2. Enable long path support in registry
Write-Host "`nChecking Long Path Support..." -ForegroundColor Cyan
$regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
$name = "LongPathsEnabled"
$beforeVal = (Get-ItemProperty $regPath).$name

if ($beforeVal -ne 1) {
    Write-Host "Long path support is disabled (current value: $beforeVal). Enabling..." -ForegroundColor Yellow
    New-ItemProperty -Path $regPath -Name $name -Value 1 -PropertyType DWORD -Force | Out-Null
    $afterVal = (Get-ItemProperty $regPath).$name
    Write-Host "Long path support enabled (new value: $afterVal)." -ForegroundColor Green
    Write-Host "Important: A system restart is required for the registry change to take full effect." -ForegroundColor Yellow
    $global:RequiresRestart = $true
} else {
    Write-Host "Long path support is already enabled (value: 1)." -ForegroundColor Green
}

# 3. Check if Visual Studio 2022 is installed
Write-Host "`nChecking Visual Studio 2022..." -ForegroundColor Cyan
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
    Write-Host "Visual Studio 2022 detected at: $vsPath" -ForegroundColor Green
    $global:VSInstallPath = $vsPath
} else {
    Write-Host "Visual Studio 2022 was not found in common locations." -ForegroundColor Red
    Write-Host "Please download and install Visual Studio 2022 Community or higher from:" -ForegroundColor Yellow
    Write-Host "https://visualstudio.microsoft.com/downloads/" -ForegroundColor Yellow
    Write-Host "Ensure the following workloads and individual components are selected:" -ForegroundColor Yellow
    Write-Host "  - Workloads: 'Desktop development with C++'" -ForegroundColor Yellow
    Write-Host "  - Component: 'MSVC v143 - VS 2022 C++ x64/x86 build tools (latest)'" -ForegroundColor Yellow
    Write-Host "  - Component: 'Windows 11 SDK (10.0.22621.0)' or 'Windows 10 SDK (10.0.20348.0)'" -ForegroundColor Yellow
    Write-Host "  - Component: 'C++ ATL for latest v143 build tools (x86 & x64)'" -ForegroundColor Yellow
    Write-Host "  - Component: 'C++ MFC for latest v143 build tools (x86 & x64)'" -ForegroundColor Yellow
    Read-Host "Press Enter after you have installed Visual Studio 2022 to continue"
    
    # Re-check installation path
    if (Test-Path $vswhere) {
        $vsPath = & $vswhere -version "[17.0,18.0)" -property installationPath
    }
    if (-not $vsPath) {
        foreach ($path in $commonPaths) {
            if (Test-Path $path) {
                $vsPath = $path
                break
            }
        }
    }
    if (-not $vsPath) {
        Write-Host "Error: Visual Studio 2022 still not detected. Aborting." -ForegroundColor Red
        Exit 1
    }
    $global:VSInstallPath = $vsPath
}

# 4. Check if Git is installed
Write-Host "`nChecking Git..." -ForegroundColor Cyan
$gitExists = Get-Command git -ErrorAction SilentlyContinue
if ($gitExists) {
    $gitVersionString = (git --version)
    Write-Host "Git detected: $gitVersionString" -ForegroundColor Green
} else {
    Write-Host "Git is not installed or not available on the current PATH." -ForegroundColor Red
    Write-Host "Please download and install Git for Windows from:" -ForegroundColor Yellow
    Write-Host "https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "During installation, ensure symbolic links are enabled." -ForegroundColor Yellow
    Read-Host "Press Enter after you have installed Git to continue"
    
    $gitExists = Get-Command git -ErrorAction SilentlyContinue
    if (-not $gitExists) {
        Write-Host "Error: Git is still not found on PATH. Aborting." -ForegroundColor Red
        Exit 1
    }
}

# 5. Check if Python 3 (3.9 - 3.11) is installed
Write-Host "`nChecking Python 3..." -ForegroundColor Cyan
$pythonExists = Get-Command python -ErrorAction SilentlyContinue
$pyVersionValid = $false

if ($pythonExists) {
    $pyVersionOutput = python --version 2>&1
    if ($pyVersionOutput -match "Python 3\.(9|10|11)\.") {
        $pyVersionValid = $true
        Write-Host "Python detected: $pyVersionOutput" -ForegroundColor Green
    } else {
        Write-Host "Python version ($pyVersionOutput) is not 3.9, 3.10, or 3.11." -ForegroundColor Yellow
    }
}

if (-not $pyVersionValid) {
    Write-Host "Python version 3.9, 3.10, or 3.11 is required (Python 3.12+ is incompatible)." -ForegroundColor Red
    Write-Host "Please download and install Python 3.11 from:" -ForegroundColor Yellow
    Write-Host "https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Ensure 'Add Python to PATH' and 'Install for all users' are checked." -ForegroundColor Yellow
    Read-Host "Press Enter after you have installed Python 3.11 to continue"
    
    $pythonExists = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonExists) {
        $pyVersionOutput = python --version 2>&1
        if ($pyVersionOutput -match "Python 3\.(9|10|11)\.") {
            $pyVersionValid = $true
            Write-Host "Python detected: $pyVersionOutput" -ForegroundColor Green
        }
    }
    
    if (-not $pyVersionValid) {
        Write-Host "Error: Python 3.9-3.11 is required. Aborting." -ForegroundColor Red
        Exit 1
    }
}

# 6. Check if Node.js 20 is installed
Write-Host "`nChecking Node.js..." -ForegroundColor Cyan
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
$nodeVersionValid = $false

if ($nodeExists) {
    $nodeVersionOutput = node --version
    if ($nodeVersionOutput -match "v20\.") {
        $nodeVersionValid = $true
        Write-Host "Node.js detected: $nodeVersionOutput" -ForegroundColor Green
    } else {
        Write-Host "Node.js version ($nodeVersionOutput) is not v20.x.x (LTS)." -ForegroundColor Yellow
    }
}

if (-not $nodeVersionValid) {
    Write-Host "Node.js v20 (LTS) is required." -ForegroundColor Red
    Write-Host "Please download and install Node.js v20 (LTS) from:" -ForegroundColor Yellow
    Write-Host "https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter after you have installed Node.js to continue"
    
    $nodeExists = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExists) {
        $nodeVersionOutput = node --version
        if ($nodeVersionOutput -match "v20\.") {
            $nodeVersionValid = $true
            Write-Host "Node.js detected: $nodeVersionOutput" -ForegroundColor Green
        }
    }
    
    if (-not $nodeVersionValid) {
        Write-Host "Error: Node.js v20 is required. Aborting." -ForegroundColor Red
        Exit 1
    }
}

# 7. Check if pnpm is installed
Write-Host "`nChecking pnpm..." -ForegroundColor Cyan
$pnpmExists = Get-Command pnpm -ErrorAction SilentlyContinue
$pnpmVersionValid = $false

if ($pnpmExists) {
    $pnpmVersionOutput = pnpm --version
    if ($pnpmVersionOutput -match "^9\.") {
        $pnpmVersionValid = $true
        Write-Host "pnpm detected: v$pnpmVersionOutput" -ForegroundColor Green
    } else {
        Write-Host "pnpm version is not 9.x.x (detected v$pnpmVersionOutput)." -ForegroundColor Yellow
    }
}

if (-not $pnpmVersionValid) {
    Write-Host "Installing pnpm v9 globally via npm..." -ForegroundColor Yellow
    npm install -g pnpm@9
    $pnpmExists = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmExists) {
        $pnpmVersionOutput = pnpm --version
        $pnpmVersionValid = $pnpmVersionOutput -match "^9\."
        Write-Host "pnpm version: v$pnpmVersionOutput" -ForegroundColor Green
    } else {
        Write-Host "Error: Installed pnpm globally, but the command is not available. Please restart your terminal." -ForegroundColor Red
        Exit 1
    }
}

# 8. Check depot_tools installation path
Write-Host "`nChecking depot_tools installation..." -ForegroundColor Cyan
$depotPath = "C:\depot_tools"
if (-not (Test-Path $depotPath)) {
    Write-Host "depot_tools not found at $depotPath. Cloning from Google repository..." -ForegroundColor Yellow
    git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git $depotPath
    Write-Host "depot_tools cloned successfully." -ForegroundColor Green
} else {
    Write-Host "depot_tools is already present at $depotPath." -ForegroundColor Green
}

# 9. Check if C:\depot_tools is in the System PATH
Write-Host "`nChecking System PATH for depot_tools..." -ForegroundColor Cyan
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$pathElements = $systemPath -split ';'
$depotInPath = $false

foreach ($element in $pathElements) {
    if ($element.Trim().ToLower() -eq "c:\depot_tools") {
        $depotInPath = $true
        break
    }
}

if (-not $depotInPath) {
    Write-Host "C:\depot_tools not found in System PATH. Adding..." -ForegroundColor Yellow
    $newPath = $systemPath + ";C:\depot_tools"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "Successfully added C:\depot_tools to the System PATH variable." -ForegroundColor Green
    Write-Host "Important: A restart of your terminal or IDE is required to reload the PATH environment." -ForegroundColor Yellow
    $global:RequiresTerminalRestart = $true
} else {
    Write-Host "C:\depot_tools is present in the System PATH." -ForegroundColor Green
}

# 10. Configure depot_tools Environment Variables
Write-Host "`nConfiguring depot_tools environment variables..." -ForegroundColor Cyan

# Set DEPOT_TOOLS_WIN_TOOLCHAIN=0
$currentToolchain = [Environment]::GetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "Machine")
if ($currentToolchain -ne "0") {
    Write-Host "Setting DEPOT_TOOLS_WIN_TOOLCHAIN=0 in system variables..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "0", "Machine")
    Write-Host "DEPOT_TOOLS_WIN_TOOLCHAIN is now set to 0." -ForegroundColor Green
} else {
    Write-Host "DEPOT_TOOLS_WIN_TOOLCHAIN is already set to 0." -ForegroundColor Green
}

# Set vs2022_install variable
$detectedVsPath = $global:VSInstallPath
if ($detectedVsPath) {
    $currentVsInstall = [Environment]::GetEnvironmentVariable("vs2022_install", "Machine")
    if ($currentVsInstall -ne $detectedVsPath) {
        Write-Host "Setting vs2022_install='$detectedVsPath' in system variables..." -ForegroundColor Yellow
        [Environment]::SetEnvironmentVariable("vs2022_install", $detectedVsPath, "Machine")
        Write-Host "vs2022_install is now set." -ForegroundColor Green
    } else {
        Write-Host "vs2022_install variable is already configured correctly." -ForegroundColor Green
    }
} else {
    Write-Host "Warning: Visual Studio 2022 path could not be verified. Skipping vs2022_install configuration." -ForegroundColor Red
}

# 11. Final Summary
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "            Aether Setup Script Summary           " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$allGood = $true

# Long Paths Check
Write-Host "Registry Long Path Support: " -NoNewline
$longPaths = (Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem").LongPathsEnabled
if ($longPaths -eq 1) {
    Write-Host "Enabled" -ForegroundColor Green
} else {
    Write-Host "Disabled" -ForegroundColor Red
    $allGood = $false
}

# Visual Studio Check
Write-Host "Visual Studio 2022:         " -NoNewline
if ($detectedVsPath) {
    Write-Host "Detected ($detectedVsPath)" -ForegroundColor Green
} else {
    Write-Host "Missing" -ForegroundColor Red
    $allGood = $false
}

# Git Check
Write-Host "Git:                        " -NoNewline
if ($gitExists) {
    Write-Host "Detected" -ForegroundColor Green
} else {
    Write-Host "Missing" -ForegroundColor Red
    $allGood = $false
}

# Python Check
Write-Host "Python (3.9 - 3.11):        " -NoNewline
if ($pyVersionValid) {
    Write-Host "Detected" -ForegroundColor Green
} else {
    Write-Host "Missing or Incompatible" -ForegroundColor Red
    $allGood = $false
}

# Node Check
Write-Host "Node.js (v20):              " -NoNewline
if ($nodeVersionValid) {
    Write-Host "Detected" -ForegroundColor Green
} else {
    Write-Host "Missing" -ForegroundColor Red
    $allGood = $false
}

# pnpm Check
Write-Host "pnpm (v9):                  " -NoNewline
if ($pnpmVersionValid) {
    Write-Host "Detected" -ForegroundColor Green
} else {
    Write-Host "Missing" -ForegroundColor Red
    $allGood = $false
}

# depot_tools Check
Write-Host "depot_tools Directory:      " -NoNewline
if (Test-Path "C:\depot_tools") {
    Write-Host "Installed" -ForegroundColor Green
} else {
    Write-Host "Missing" -ForegroundColor Red
    $allGood = $false
}

# System PATH Check
Write-Host "depot_tools System PATH:    " -NoNewline
if ($depotInPath) {
    Write-Host "Configured" -ForegroundColor Green
} else {
    Write-Host "Missing from active PATH (System Path updated)" -ForegroundColor Yellow
}

# DEPOT_TOOLS_WIN_TOOLCHAIN Check
Write-Host "DEPOT_TOOLS_WIN_TOOLCHAIN:  " -NoNewline
if ([Environment]::GetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "Machine") -eq "0") {
    Write-Host "Set (0)" -ForegroundColor Green
} else {
    Write-Host "Not configured" -ForegroundColor Red
    $allGood = $false
}

# vs2022_install Check
Write-Host "vs2022_install Variable:    " -NoNewline
if ([Environment]::GetEnvironmentVariable("vs2022_install", "Machine")) {
    Write-Host "Configured" -ForegroundColor Green
} else {
    Write-Host "Not configured" -ForegroundColor Red
    $allGood = $false
}

Write-Host "--------------------------------------------------" -ForegroundColor Cyan

if ($global:RequiresRestart) {
    Write-Host "IMPORTANT: A Windows restart is required to apply the Long Path support registry changes." -ForegroundColor Yellow
}
if ($global:RequiresTerminalRestart) {
    Write-Host "IMPORTANT: A restart of your terminal or IDE is required to reload the PATH variable." -ForegroundColor Yellow
}

if ($allGood) {
    Write-Host "Success: Build environment check and configuration completed." -ForegroundColor Green
} else {
    Write-Host "Warning: Some requirements are still missing. Review the items listed in Red." -ForegroundColor Yellow
}
Write-Host "==================================================" -ForegroundColor Cyan
