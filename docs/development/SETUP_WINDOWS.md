# Windows Development Environment Setup

## Overview

Building Aether on Windows requires setting up the Chromium build toolchain. This is more involved than a standard web or app project. Read this document completely before running any commands.

Estimated time to complete environment setup (not including the first build): 45 to 90 minutes.
Estimated time for first build after environment is set up: 2 to 4 hours depending on hardware.

## Hardware Requirements

- CPU: 8 cores minimum. 16 cores recommended. More cores = significantly faster builds.
- RAM: 32 GB recommended. 16 GB minimum (builds will be slow and may swap).
- Disk: 300 GB free space on a fast drive (NVMe SSD strongly recommended).
  - Chromium source checkout: ~45 GB
  - Build artifacts (debug build): ~80–120 GB
  - Build artifacts (release build): ~40–60 GB
- OS: Windows 10 version 22H2 (build 19045) or Windows 11.

## Step 1 — Enable Long Path Support

Windows has a 260-character path limit by default. Chromium's source tree exceeds this. You must enable long paths before doing anything else.

Run PowerShell as Administrator and execute:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

Verify:
```powershell
(Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem").LongPathsEnabled
```
Expected output: `1`

Restart Windows after enabling long paths.

## Step 2 — Install Visual Studio 2022

Chromium requires MSVC (Microsoft C++ compiler). Visual Studio Code is not sufficient. You need Visual Studio 2022 (Community edition is acceptable).

Download from: https://visualstudio.microsoft.com/downloads/

During installation, select these workloads:
- Desktop development with C++

Under Individual Components, ensure these are selected:
- MSVC v143 - VS 2022 C++ x64/x86 build tools (latest)
- Windows 11 SDK (10.0.22621.0) or Windows 10 SDK (10.0.20348.0)
- C++ ATL for latest v143 build tools (x86 & x64)
- C++ MFC for latest v143 build tools (x86 & x64)

Verify after installation:
```cmd
cl.exe
```
If MSVC is on your PATH, this should print the compiler version.

## Step 3 — Install Git for Windows

Download from: https://git-scm.com/download/win

During installation:
- Select "Git from the command line and also from 3rd-party software"
- Select "Use Windows' default console window"
- Select "Checkout as-is, commit Unix-style line endings"
- Select "Enable symbolic links"

Configure git after installation:
```cmd
git config --global core.autocrlf false
git config --global core.filemode false
git config --global branch.autosetuprebase always
```

Verify:
```cmd
git --version
```
Expected: git version 2.40.0 or higher.

## Step 4 — Install Python 3

Chromium's build system requires Python 3. Version must be 3.9, 3.10, or 3.11. Python 3.12+ has compatibility issues with some Chromium build scripts.

Download Python 3.11 from: https://www.python.org/downloads/

During installation:
- Check "Add Python to PATH"
- Check "Install for all users"

Verify:
```cmd
python --version
```
Expected: Python 3.11.x

## Step 5 — Install Node.js

Brave's build toolchain and the Aether WebUI both require Node.js 20 LTS.

Download from: https://nodejs.org/en/download (select v20 LTS)

Verify:
```cmd
node --version
```
Expected: v20.x.x

Install pnpm (Aether's package manager):
```cmd
npm install -g pnpm@9
```

Verify:
```cmd
pnpm --version
```
Expected: 9.x.x

## Step 6 — Install depot_tools

depot_tools is Google's build toolchain manager. It provides gclient, gn, and ninja.

```cmd
cd C:\
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

Add `C:\depot_tools` to your system PATH (not user PATH — system PATH).

To add via PowerShell as Administrator:
```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\depot_tools",
  "Machine"
)
```

Restart your terminal after modifying PATH.

Verify:
```cmd
gclient --version
```
Expected: prints gclient version information without errors.

## Step 7 — Configure depot_tools for Windows

```cmd
set DEPOT_TOOLS_WIN_TOOLCHAIN=0
set vs2022_install=C:\Program Files\Microsoft Visual Studio\2022\Community
```

Add both environment variables permanently via System Properties > Environment Variables > System Variables.

## Step 8 — Verify Complete Environment

Run the Aether environment verification script:
```powershell
cd path\to\aether
powershell -ExecutionPolicy Bypass -File tools\scripts\verify-env.ps1
```

All checks must pass before proceeding to the Brave fork setup.

## Next Step

See `docs/development/BRAVE_FORK_GUIDE.md` to initialize the Brave fork.

## Troubleshooting

### Python not found during build
Ensure Python is on the system PATH, not just the user PATH. Chromium's build runs in contexts where user PATH is not available.

### Long path errors during gclient sync
Confirm long path support was enabled and Windows was restarted after enabling it.

### MSVC not found by GN
Ensure `vs2022_install` environment variable points to the correct Visual Studio installation path.
